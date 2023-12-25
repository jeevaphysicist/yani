const mongoose = require('mongoose');
const schema = mongoose.Schema({
        UserID: {
                  type: mongoose.Schema.Types.ObjectId, 
                   ref: 'User', 
                   required: true
           },      
           ProductID:{
            type:String,
            required:true,
           },
        ProductName:{
                   type:String,
                   required:true
            },
        QuantityType:{
                type:String,
                required:true
            },
        Quantity:{
                type:Number,
                required:true
            }
});

module.exports =  mongoose.model("UserProducedInventory",schema,"UserProducedInventory")