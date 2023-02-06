import mongoose from 'mongoose';
import mongooseSlugPlugin from 'mongoose-slug-plugin';
import fs from 'fs';
import path from 'path';
import url from 'url';

const UserSchema = new mongoose.Schema({
	username: {type: String, required: true},
    password: {type: String, unique: true, required: true},
    email: {type: String, required: true},
	chats: Object
});

const ImageSchema = new mongoose.Schema({
    data: Buffer, 
    contentType: String
});

const ItemSchema = new mongoose.Schema({
    user: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    title: {type: String, required: true},
    category: {type: String, required: true},
    description: {type: String, required: true},
    price: {type: String, required: true},
    image: ImageSchema,
    state: String,
    createdAt: {type: Date, default: Date.now}
});

const MessageSchema = new mongoose.Schema({
    message: String,
    user: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    createdAt: {type: Date, default: Date.now}
});

const ChatSchema = new mongoose.Schema({
    users: [{type: mongoose.Types.ObjectId, ref: 'User', required: true}],
    item: {type: mongoose.Types.ObjectId, ref: 'Item', required: true},
    messages: [MessageSchema],
    createdAt: {type: Date, default: Date.now},
    updatedAt: {type: Date, default: Date.now}
});

UserSchema.plugin(mongooseSlugPlugin, {tmpl: '<%=_id%>'});
ItemSchema.plugin(mongooseSlugPlugin, {tmpl: '<%=_id%>'});
ChatSchema.plugin(mongooseSlugPlugin, {tmpl: '<%=_id%>'});

mongoose.model('User', UserSchema);
mongoose.model('Item', ItemSchema);
mongoose.model('Chat', ChatSchema);
mongoose.model('Message', MessageSchema);
mongoose.model('Image', ImageSchema);

// connect
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);
 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/finalpj';
}
mongoose.connect(dbconf);