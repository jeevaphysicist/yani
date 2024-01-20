const ProducedInventory = require('../Models/ProducedInventory');
const UserProducedInventry = require('../Models/UserProducedInventry');

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
exports.createProducedInventory = (req,res)=>{
    const uniqueShortId = generateShortId();
    let data ={
            ProductID: uniqueShortId,
            ProductName:req.body.ProductName,
            QuantityType:req.body.QuantityType
    }
    if(!req.body.ProductName || !req.body.QuantityType )
    return res.status(404).json({message:"Something went wrong"});
    ProducedInventory.create(data).then(result=>{
        res.status(201).json({message:"Data Produced Inventory Created Succesfully" ,isSuccess:true})
 })
 .catch(err=>res.status(500).jons({ error : err , message:"error in database" }));          
} 


// Get  a Produced Inventory
exports.GetProducedInventoryData = async (req,res)=>{
  try {
    const producedInventoryProducts = await ProducedInventory.find();
     let result = [];
    for (const producedProduct of producedInventoryProducts) {
        const userInventoryEntries = await UserProducedInventry.find({ ProductID: producedProduct.ProductID });
        const totalQuantity = userInventoryEntries.reduce((total, entry) => total + entry.Quantity, 0);
    
        let data = {
           _id:producedProduct._id,
           ProductID:producedProduct.ProductID,
           ProductName:producedProduct.ProductName,
           QuantityType:producedProduct.QuantityType,
           TotalQuantity:totalQuantity
        };
        result.push(data);                
    }
    res.status(200).json({
           message:"Get Produced data Successfully ",
           data:result
       })

} catch (error) {
  res.status(500).json({
      message:"Internal Server Error",
      error
  })
}
} 

exports.updateProducedInventory = async (req,res)=>{      
  if(!req.body.ProductName || !req.body.QuantityType ||!req.body.id ||!req.body.ProductID )
  return res.status(404).json({message:"Something went wrong"});
  ProducedInventory.updateOne( { _id:req.body.id } , req.body).then(result=>{
      res.status(200).json({ message:"Document Update Successfully",data:result ,isSuccess:true})   
  })
  .catch(err=>{
   res.status(500).json({message:"error in database",error:err})
  })
}

exports.deleteproduct = async (req,res)=>{
  console.log(req.params.id)
  ProducedInventory.deleteOne({ _id: req.params.id })
  .then(result => {
      res.status(200).json({ message: "Delete Product Successfully" ,isSuccess:true});
  })
  .catch(err => {
      res.status(500).json({ message: "Error in database", error: err ,isSuccess:false});
  });

}

