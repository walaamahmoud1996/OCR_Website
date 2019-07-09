const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const {userModel} = require('../models/userModel');

var AddHardcodedAdmin = (req,res,next)=>{
  var email = 'admintest@test.com'
  var password = 'admin123'
  userModel.find({email})
  .then((results)=>{
    //the admin user isn't into the db
    if(results.length === 0){
      bcrypt.hash(password,1,(err,hash)=>{
        if(err) throw err;
        else {
          const userDoc = new userModel({
            _id : new mongoose.Types.ObjectId(),
            email: email,
            password: hash,
            user_type: 'admin',
            user_site: 'any'
          })
          userDoc.save()
        }
      });
    }
  })
  .catch((err)=>{
    res.status(400).json({
    error : err
    });
  })
  next();
}
module.exports = {
  AddHardcodedAdmin
}
