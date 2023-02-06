import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import * as validate from './public/js/validate-input.mjs';

const User = mongoose.model('User');

const startAuthenticatedSession = (req, user, cb) => {
  req.session.regenerate((err) => {
    if (!err) {
      req.session.user = user;
    } 
    else {
      console.log(err);
    }
    cb(err);
  });
};

const endAuthenticatedSession = (req, cb) => {
  req.session.destroy((err) => { cb(err); });
};

const register = (username, email, password, errorCallback, successCallback) => {
  const usernameCheck = validate.checkUsername(username);
  const emailCheck = validate.checkEmail(email);
  const passwordCheck = validate.checkPassword(password);
  if(!usernameCheck.isValid){
    errorCallback({message: "Invalid username"});
  } 
  else if(!emailCheck.isValid){
    errorCallback({message: "Invalid email"});
  }
  else if(!passwordCheck.isValid){
    errorCallback({message: "Invalid password"});
  }
  else{
    User.findOne({username: username}, (err, result) => { 
      if(err){
        errorCallback();
      }
      else if(result){
        errorCallback({message: "Username already exists"});
      }
      else{
        bcrypt.genSalt(10, function(err, salt) {
          if(!err){
            bcrypt.hash(password, salt, function(err, hash) {
              if(!err){
                const user = new User({
                  username: username,
                  email: email,
                  password: hash
                });
                user.save(function(err, result) {
                  if(err){
                    errorCallback({message: "Document save error"});
                  } else{
                    successCallback(result);
                  }});
              }});
          }});
      }});
  }
};

const login = (username, password, errorCallback, successCallback) => {
  User.findOne({username: username}, (err, user) => {
    if(err){
      errorCallback({message: "ERROR"});
    }
    else if(!user){
      errorCallback({message: "USER NOT FOUND"});
    }
    else{
      bcrypt.compare(password, user.password, (err, passwordMatch) => {
        if(err){
          errorCallback({message: "ERROR"});
        }
        if(passwordMatch){
          successCallback(user);
        } else{
          errorCallback({message: "PASSWORDS DO NOT MATCH"});
        }
      });
    }
   });
};

// creates middleware that redirects to login if path is included in authRequiredPaths
const authRequired = authRequiredPaths => {
  return (req, res, next) => {
    let isValid = true;
    authRequiredPaths.forEach(path => {
      if(req.path.startsWith(path)){
        isValid = false;
      }
    });
    if(!isValid) {
      if(!req.session.user) {
        res.redirect('/login'); 
      } else {
        next(); 
      }
    } else {
      next(); 
    }
  };
};

export {
  startAuthenticatedSession,
  endAuthenticatedSession,
  register,
  login,
  authRequired
};
