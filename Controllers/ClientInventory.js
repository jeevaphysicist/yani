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
    if(!req.body.ClientAddress || !req.body.ClientName  )
    return res.status(404).json({message:"Please Fill the Data"});

    ClientInventory.create(data).then(result=>{
        res.status(201).json({message:"Data Client Inventory Created Succesfully",isSuccess:true})
 })
 .catch(err=>res.status(500).json({ error : err , message:"error in database" }));          
} 

exports.updateClietnInventory = async (req,res)=>{     
       if(!req.body.ClientAddress || !req.body.ClientName ||!req.body.id )
         return res.status(404).json({message:"Please Select a Data"});
  ClientInventory.updateOne( { _id:req.body.id } , req.body).then(result=>{
      res.status(200).json({ message:"Document Update Successfully",data:result ,isSuccess:true })   
  })
  .catch(err=>{
   res.status(500).json({message:"error in database",error:err})
  })
}

// Get  a Produced Inventory
exports.GetClientInventoryData = (req,res)=>{
    ClientInventory.find().then(result=>{
        res.status(201).json({message:"Get  Client Inventory Data Succesfully",data:result})
 })
 .catch(err=>res.status(500).jons({ error : err , message:"error in database" }));          
} 

