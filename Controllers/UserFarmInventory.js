const UserFarmInventory = require('../Models/UserFarmInventry');


// User Create a Produced Inventory data
exports.createUserFarmInventory = async (req, res) => {
  try {
    // console.log('req.body', req.body);
    const quantity = parseInt(req.body.Quantity, 10);

    // Find the product in the database based on ProductID
    let product = await UserFarmInventory.findOne({ ProductID: req.body.ProductID , UserID:req.body.UserID });

    // console.log('product', product);

    if (!product) {
      // If the product is not found, create a new document

      let data = {
        ProductID: req.body.ProductID,
        ProductName: req.body.ProductName,
        QuantityType: req.body.QuantityType,
        Quantity: quantity,
        UserID: req.body.UserID,
      };

      UserFarmInventory.create(data)
        .then((result) => {
          res.status(201).json({ message: 'Data Farm Inventory Created Successfully' , isSuccess:true });
        })
        .catch((err) => {
          res.status(500).json({ error: err, message: 'Error in database' });
        });
    } else {
      // If the product is found, update the quantity
      product.Quantity = product.Quantity + quantity;

      // Save the updated product
      await product.save();

      return res.status(200).json({ message: 'Quantity updated successfully' , isSuccess:true });
    }
  } catch (err) {
    // Handle any unexpected errors
    res.status(500).json({ error: err, message: 'Internal server Error' });
  }
};



// Get  a Produced Inventory
exports.GetUserFarmInventoryData = (req,res)=>{
    UserFarmInventory.find({UserID : req.params.id}).then(result=>{
        res.status(201).json({message:"Get  Farm Inventory Data Succesfully",data:result})
 })
 .catch(err=>res.status(500).json({ error : err , message:"error in database" }));          
} 


// Update Farm Inventory
exports.UpdateUserFarmINventory = async (req,res)=>{
        let {id , usedQuantity} = req.body
        try{
      // Find the product by productName
    const product = await UserFarmInventory.findOne({ _id : id });

    if (product) {
      const updatedQuantity = product.Quantity - usedQuantity;

      if (updatedQuantity >= 0) {
        // Update the quantity in the database
        await UserFarmInventory.updateOne({ _id : id}, { $set: { Quantity: updatedQuantity } });
        res.status(200).json({ message: `Updated quantity  ${updatedQuantity}` , isSuccess:true });
      } else {
        res.status(400).json({ error: `Not enough quantity available` });
      }
    } else {
      res.status(404).json({ error: `Product not found in the database` });
    }
}
catch (error) {
    console.error('Error updating quantity:', error);
    res.status(500).json({ error: 'Internal server error' });
  } 
}

