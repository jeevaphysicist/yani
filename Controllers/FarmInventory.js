const FarmInventory = require('../Models/FarmInventory');
const UserFarmInventory = require('../Models/UserFarmInventry');

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
exports.GetFarmInventoryData = async (req,res)=>{
       try {
              const farmInventoryProducts = await FarmInventory.find();
               let result = [];
              for (const farmProduct of farmInventoryProducts) {
                  const userInventoryEntries = await UserFarmInventory.find({ ProductID: farmProduct.ProductID });
                  const totalQuantity = userInventoryEntries.reduce((total, entry) => total + entry.Quantity, 0);
              
                  let data = {
                     _id:farmProduct._id,
                     ProductID:farmProduct.ProductID,
                     ProductName:farmProduct.ProductName,
                     QuantityType:farmProduct.QuantityType,
                     TotalQuantity:totalQuantity
                  };
                  result.push(data);                
              }
              res.status(200).json({
                     message:"Get Farm data Successfully ",
                     data:result
                     })
          } catch (error) {
              res.status(500).json({
                     message:"Internal Server Error",
                     error
                 })
          }
} 

exports.updateFarmInventory = async (req,res)=>{      
       //   console.log("req.body",req.body);
         if(!req.body.ProductName || !req.body.QuantityType ||!req.body.id ||!req.body.ProductID )
          return res.status(404).json({message:"Something went wrong"});
          FarmInventory.updateOne( { _id:req.body.id } , req.body).then(result=>{
              res.status(200).json({ message:"Document Update Successfully",data:result ,isSuccess:true })   
          })
          .catch(err=>{
           res.status(500).json({message:"error in database",error:err})
          })
     }

exports.deleteproduct = async (req,res)=>{
       console.log(req.params.id)
       FarmInventory.deleteOne({ _id: req.params.id })
       .then(result => {
           res.status(200).json({ message: "Delete Product Successfully" ,isSuccess:true});
       })
       .catch(err => {
           res.status(500).json({ message: "Error in database", error: err ,isSuccess:false});
       });
     
     }