const mongoose = require('mongoose');
const schema = mongoose.Schema({
                          UserName:{
                             type:String,
                             required:true   
                          },
                          Password:{
                            type:String,
                            required:true 
                          },
                          Email:{
                            type:String,
                            required:true 
                          },
                          Role:{
                            type:String,
                            required:true,
                            default:"User" 
                          }
});

module.exports = mongoose.model("User",schema,"User")