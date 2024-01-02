const FarmInventory = require('../Models/FarmInventory');

// Function to generate a random alphanumeric string with 4 digits
function generateShortId() {
       const characters = '0123456789';
       let shortId = 'FI';
     
       for (let i = 0; i < 4; i++) {
         const randomIndex = Math.floor(Math.random() * characters.length);
         shortId += characters.charAt(randomIndex);
       }
     
       return shortId;
     }

// Admin create a FarmInventory Data
exports.createFarmInventory = (req,res)=>{
        
       // Generate a unique four-digit short ID
       const uniqueShortId = generateShortId();
       let data ={
               ProductID: uniqueShortId,
               ProductName:req.body.ProductName,
               QuantityType:req.body.QuantityType
       }
       if(!req.body.ProductName || !req.body.QuantityType)
        return res.status(404).json({message:"Please Fill Details"});
        FarmInventory.create(data).then(result=>{
               res.status(201).json({message:"Data Farm Inventory Created Succesfully",isSuccess:true})
        })
        .catch(err=>res.status(500).jons({ error : err , message:"error in database" }));
} 



// Get  a Farm Inventory Data
exports.GetFarmInventoryData = (req,res)=>{
    FarmInventory.find().then(result=>{
        res.status(201).json({message:"Get Farm Inventory Data Succesfully",data:result ,isSuccess:true})
 })
 .catch(err=>res.status(500).json({ error : err , message:"error in database" }));          
} 

exports.updateFarmInventory = async (req,res)=>{      
       //   console.log("req.body",req.body);
         if(!req.body.ProductName || !req.body.QuantityType ||!req.body.id )
          return res.status(404).json({message:"Something went wrong"});
          FarmInventory.updateOne( { _id:req.body.id } , req.body).then(result=>{
              res.status(200).json({ message:"Document Update Successfully",data:result ,isSuccess:true })   
          })
          .catch(err=>{
           res.status(500).json({message:"error in database",error:err})
          })
     }