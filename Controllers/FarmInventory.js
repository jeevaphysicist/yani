const FarmInventory = require('../Models/FarmInventory');

// Function to generate a random alphanumeric string with 4 digits
function generateShortId() {
       const characters = '0123456789';
       let shortId = '';
     
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
        FarmInventory.create(data).then(result=>{
               res.status(201).json({message:"Data Farm Inventory Created Succesfully"})
        })
        .catch(err=>res.status(500).jons({ error : err , message:"error in database" }));
} 



// Get  a Farm Inventory Data
exports.GetFarmInventoryData = (req,res)=>{
    FarmInventory.find().then(result=>{
        res.status(201).json({message:"Get Farm Inventory Data Succesfully",data:result})
 })
 .catch(err=>res.status(500).jons({ error : err , message:"error in database" }));          
} 