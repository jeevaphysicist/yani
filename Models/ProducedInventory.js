const mongoose = require('mongoose');
const schema = mongoose.Schema({
         ProductID:{
               type:String,
                required:true,
                unique: true
           },
        ProductName:{
                   type:String,
                   required:true
            },
            QuantityType:{
                type:String,
                required:true
            }
});

module.exports =  mongoose.model("ProducedInventory",schema,"ProducedInventory")