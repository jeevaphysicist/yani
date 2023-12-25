const mongoose = require('mongoose');
const schema = mongoose.Schema({
          ClientDetails:{
                   type:Object,
                   required:true
            },
          BillNo:{
                type:String,
                required:true
            },
          BillingDate:{
                type:String,
                required:true
            },
          ProductDetails:{
                type:[{ ProductName: String , Quantity: Number , QuantityType: String , ProductID: String , id :String }],
                required:true
            },
          SubTotal:{
                type:Number,
                required:true
           }
},{timestamps:true});

module.exports =  mongoose.model("BillInventory",schema,"BillInventory")