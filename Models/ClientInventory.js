const mongoose = require('mongoose');
const schema = mongoose.Schema({
          ClientName:{
                   type:String,
                   required:true
            },
          ClientAddress:{
                type:String,
                required:true
            }
});

module.exports =  mongoose.model("ClientInventory",schema,"ClientInventory")