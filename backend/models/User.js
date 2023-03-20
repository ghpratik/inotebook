const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
   name:{
    type: String,
    required: true
   },
   email:{
    type: String,
    required: true,
    unique: true
   },
   password:{
    type: String,
    required: true
   },
   date:{
    type: String,
    default: Date.now
   },
   verify:{
    type: String,
    default: "false"
   },
  });
  const User = mongoose.model('user', UserSchema);

  module.exports = mongoose.model('user', UserSchema);