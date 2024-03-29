const mongoose = require('mongoose');
const schema = mongoose.Schema({
          Date:{
                   type:String,
                   required:true
            },
          GRNRGN:{
                type:String,
                required:true
            },
          ProductID:{
                type:String,
                required:true
            },
          ProductName:{
                type:String,
                required:true
            },
          Price:{
                type:Number,
                required:true
            },
          Quantity:{
                type:Number,
                required:true
            },
          OrderNumber:{
              type:String,
              required:true
            },
          CheckNo:{
             type:String,             
          },
          BankInDate:{
            type:String,
        },
        CheckAmount:{ 
            type:Number,
        },
        CheckStatus:{
            type:String,
            default:"PENDING",
            enum:["PENDING","PENDING_BID","COMPLETED"]
        },
        TotalAmount:{
          type:Number, 
          required:true
        },
        PurchaseNo:{
           type:String
        } 

});

module.exports =  mongoose.model("Billing",schema,"Billing")