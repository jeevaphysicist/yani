const ClientInventory = require('../Models/ClientInventory');

// Function to generate a random alphanumeric string with 4 digits
function generateShortId() {
    const characters = '0123456789';
    let shortId = 'VE';
  
    for (let i = 0; i < 4; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      shortId += characters.charAt(randomIndex);
    }
  
    return shortId;
  }


// Admin Create a Produced Inventory data
exports.createClientInventory = (req,res)=>{
    const uniqueShortId = generateShortId();
    let data ={
            ClientName:req.body.ClientName,
            ClientAddress:req.body.ClientAddress
    }

    ClientInventory.create(data).then(result=>{
        res.status(201).json({message:"Data Client Inventory Created Succesfully"})
 })
 .catch(err=>res.status(500).jons({ error : err , message:"error in database" }));          
} 


// Get  a Produced Inventory
exports.GetClientInventoryData = (req,res)=>{
    ClientInventory.find().then(result=>{
        res.status(201).json({message:"Get  Client Inventory Data Succesfully",data:result})
 })
 .catch(err=>res.status(500).jons({ error : err , message:"error in database" }));          
} 

