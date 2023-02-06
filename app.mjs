import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import session from 'express-session';
import './db.mjs';
import mongoose from 'mongoose';
import * as auth from './auth.mjs';
import { createServer } from 'http';
import { Server } from 'socket.io';
import hbs from 'hbs';
import hbs_dateformat from 'handlebars-dateformat';
import * as validate from './public/js/validate-input.mjs';
import multer from 'multer';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __publicPath = path.resolve(__dirname, "public");
const __uploadsPath = path.resolve(__dirname, "uploads");

const sessionOptions = {
  secret: 'secret',
	resave: true,
	saveUninitialized: true
};

const Item = mongoose.model('Item');
const User = mongoose.model('User');
const Chat = mongoose.model('Chat');
const Message = mongoose.model('Message');
const Image = mongoose.model('Image');

const loginMessages = {"PASSWORDS DO NOT MATCH": 'Incorrect password', "USER NOT FOUND": 'User doesn\'t exist', "ERROR": "System error"};

hbs.registerHelper('dateFormat', hbs_dateformat);
hbs.registerHelper('buffer', function(data) {
  return Buffer.from(data).toString('base64');
});
// https://stackoverflow.com/questions/8853396/logical-operator-in-a-handlebars-js-if-conditional
hbs.registerHelper('ifCond', function(v1, v2, options) {
  if(v1.toString() === v2.toString()) {
      return options.fn(this);
  }
  return options.inverse(this);
});

// https://waystoweb.com/upload-image-multer-express-mongoose/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __uploadsPath);
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage, limits: {files: 1, fileSize: 1024 * 1024 * 15.5} });

const app = express();
app.set('view engine', 'hbs');
app.use(express.static(__publicPath));
app.use(express.urlencoded({ extended: false }));
app.use(session(sessionOptions));
app.use(express.json());
const server = createServer(app);
const io = new Server(server);

// make {{user}} variable available for all paths
app.use((req, res, next) => {
  res.locals.sesUser = req.session.user;
  next();
});

// require authenticated user for these paths
app.use(auth.authRequired(['/items/add', '/chat']));

app.get('/', function(req, res) {
  const search = (req.query.search || '');
  const category = req.query.category || ['furnitures', 'clothes', 'books', 'hobbies', 'others'];
  if(search !== ''){
    Item.find({category: category, title: { $regex: search, $options: 'i' }}).sort({ createdAt: -1 }).exec((err, items) => {
      if(!err){
        res.render('home', {home: true, items: items});
      }
    });
  } 
  else {
    Item.find({category: category}).sort({ createdAt: -1 }).exec((err, items) => {
        if(!err){
          res.render('home', {home: true, items: items});
        }
    });
  }
});

app.get('/items/add', (req, res) => {
  res.render('add-item');
});

app.post('/items/add', upload.single('image'), (req, res) => {
  const titleCheck = validate.checkTitle(req.body.title);
  const categoryCheck = validate.checkCategory(req.body.category);
  const priceCheck = validate.checkPrice(req.body.price);
  const descriptionCheck = validate.checkDescription(req.body.description);
  function error(err) {
    res.render('add-item', {message: err.message ?? 'Error while adding item'});
  }
  if(!titleCheck.isValid){
    error({message: "Invalid title"});
  } 
  else if(!categoryCheck.isValid){
    error({message: "Invalid category"});
  }
  else if(!priceCheck.isValid){
    error({message: "Invalid price"});
  }
  else if(!descriptionCheck.isValid){
    error({message: "Invalid description"});
  }
  else{
    let image;
    if(req.file){
      image = new Image({
        data: fs.readFileSync(path.join(__dirname + "/uploads/" + req.file.filename)),
        contentType: "image/png"
      });
    }
    const item = new Item({
        user: req.session.user._id,
        title: req.body.title,
        category: req.body.category,
        price: req.body.price,
        description: req.body.description,
        image: image
    });
    item.save(function(err, result) {
        if(!err){
          res.redirect('/');
        }
        else{
          res.render('add-item', {message: 'Error while adding item'}); 
        }
    });
  }
});

app.get('/items/:slug', (req, res) => {
  Item.findOne({slug: req.params.slug}).exec(function(err, result) {
    if(!err){
      res.render('item-detail', {item: result}); 
    }
    else{
      res.render('error', {message: 'Error while getting detail'}); 
    }
  });
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  function success(newUser) {
      auth.startAuthenticatedSession(req, newUser, (err) => {
          if (!err) {
              res.redirect('/');
          } else {
            res.render('error', {message: 'Error starting auth sess: ' + err}); 
          }
      });
  }
  function error(err) {
      res.render('register', {message: err.message ?? 'Registration error'}); 
  }
  auth.register(req.body.username, req.body.email, req.body.password, error, success);
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.post('/login', (req, res) => {
  function success(user) {
    auth.startAuthenticatedSession(req, user, (err) => {
      if(!err) {
        res.redirect('/'); 
      } else {
        res.render('error', {message: 'Error starting auth sess: ' + err}); 
      }
    }); 
  }
  function error(err) {
    res.render('login', {message: loginMessages[err.message] || 'Login unsuccessful'}); 
  }
  auth.login(req.body.username, req.body.password, error, success);
});

app.get('/logout', function(req, res) {
  function logout() {
      auth.endAuthenticatedSession(req, (err) => {
          if(!err) {
              res.redirect('/'); 
          } else {
            res.render('error', {message: 'Error starting auth sess: ' + err}); 
          }
      }); 
  }
  logout();
});

async function getUsername(id){
  return (await User.findOne({_id: id})).username;
}

async function getUsernames(ids) {
  const usernames = [];
  for(let i = 0; i < ids.length; i++){
    usernames.push(await getUsername(ids[i]));
  }
  return usernames;
}

async function getTitle(id){
  return (await Item.findOne({_id: id})).title;
}

async function getTitles(ids) {
  const titles = [];
  for(let i = 0; i < ids.length; i++){
    titles.push(await getTitle(ids[i]));
  }
  return titles;
}

app.get('/chat/:slug', (req, res) => {
  if(req.params.slug === 'chats'){
    Chat.find({users: req.session.user._id}).sort({ createdAt: -1 }).exec(async function(err, allChats) {
      if(!err){
        const urls = allChats.map(chat => `/chat/${chat._id}`);
        const itemIds = allChats.map(chat => chat.item);
        const userIds = allChats.map(chat => chat.users).map(usersArr =>
          usersArr.filter(user => user !== req.session.user._id)[0]
        );
        const usernames = await getUsernames(userIds);
        const titles = await getTitles(itemIds);
        const infos = [];
        for(let i = 0; i < urls.length; i++){
          infos.push({url: urls[i], title: titles[i], username: usernames[i]});
        }
        res.render('chat', {infos: infos}); 
      }
    });
  } else{
  Chat.findOne({slug: req.params.slug}).exec(function(err, result) {
    if(!err && result){
      //check if valid user
      if(result.users.includes(req.session.user._id)){
        console.log("chat found, ", result.slug);
        Chat.find({users: req.session.user._id}).sort({ createdAt: -1 }).exec(async function(err, allChats) {
          if(!err){
            const urls = allChats.map(chat => `/chat/${chat._id}`);
            const itemIds = allChats.map(chat => chat.item);
            const userIds = allChats.map(chat => chat.users).map(usersArr =>
              usersArr.filter(user => user !== req.session.user._id)[0]
            );
            const usernames = await getUsernames(userIds);
            const titles = await getTitles(itemIds);
            const infos = [];
            for(let i = 0; i < urls.length; i++){
              infos.push({url: urls[i], title: titles[i], username: usernames[i]});
            }
            res.render('chat', {chat: result, infos: infos}); 
          }
        });
      } else{
        res.render('error', {message: 'Unauthorized access to chat'});
      }
    } else{
      res.render('error', {message: 'Error while getting chat'}); 
    }
  });
  }
});

//default route
app.get("*", (req, res) => {
  res.redirect('/');
});

io.on('connection', function(socket) {
	console.log(socket.id, 'has connected!');
  socket.on('disconnect', () => {
    console.log("disconnected");
  });

  socket.on('openChat', ({user_id, item_user_id, item_id}) => {
    if(user_id === item_user_id){
      // show only chat rooms sidebar
      socket.emit('openChat', '/chat/chats');
    } else{
    Chat.findOne({ users: { $all: [user_id, item_user_id] }, item: item_id }, (err, result) => {
      if(!err){
        if(!result){
            console.log("found none");
            const chat = new Chat({
              users: [user_id, item_user_id],
              item: item_id,
              createdAt: Date.now()
            });
            chat.save();
            socket.emit('openChat', `/chat/${chat.slug}`);
        }
        else{
            console.log("found");
            socket.emit('openChat', `/chat/${result.slug}`);
        }
      }
    });
    }
  });

  socket.on('sendChat', async ({msg, user_id, chat_id}) => {
    const message = new Message({
      message: msg,
      user: user_id,
      createdAt: Date.now()
    });
    await Chat.findOneAndUpdate({_id: chat_id}, {$push:{messages: message}});
    //io.sockets.emit('sendChat', {msg, user_id});
    io.to(chat_id).emit('sendChat', {msg, user_id});
  });

  socket.on('joinRoom', (chat_id) => {
    console.log("socket joined ", chat_id);
    socket.join(chat_id);
  });
});

server.listen(process.env.PORT || 3000);
