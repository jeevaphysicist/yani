const UserProducedInventory = require('../Models/UserProducedInventry');
const BillingInventory = require('../Models/BillInventory');
const Billing = require('../Models/Billing');
const nodemailer = require('nodemailer');

// User Create a Produced Inventory data
  exports.createUserProducedInventory = async (req, res) => {
    try {
      // console.log('req.body', req.body);
      const quantity = parseInt(req.body.Quantity, 10);
  
      // Find the product in the database based on ProductID
      let product = await UserProducedInventory.findOne({ ProductID: req.body.ProductID , UserID:req.body.UserID });
  
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
  
        UserProducedInventory.create(data)
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
exports.GetUserProducedInventoryData = (req,res)=>{
    UserProducedInventory.find({UserID : req.params.id}).then(result=>{
        res.status(201).json({message:"Get  Produced Inventory Data Succesfully",data:result})
 })
 .catch(err=>res.status(500).json({ error : err , message:"error in database" }));          
} 



 

const SendEmail = (data)=>{
  // console.log("data",data);

    let mailOptions = {
        from: process.env.email,
        to: process.env.Toemail,
        subject: `New Appointment from `,
        html: `<h1>Contact Details</h1>
        <div style="border: 2px solid #3498db; border-radius: 10px; padding: 20px; background-color: #f0f0f0; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
            <p style="font-size: 18px; color: #333; margin: 0; padding-bottom: 10px;">Name: ${req.body.name}</p>
            <p style="font-size: 18px; color: #333; margin: 0; padding-bottom: 10px;">Mobile no: ${req.body.phoneNumber}</p>
            <p style="font-size: 18px; color: #333; margin: 0;">Time Slot: ${req.body.timeSlot}</p>
        </div>`
      };
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.email,
          pass: process.env.password
        }
      });

      transporter.sendMail(mailOptions, function(error, info) {
        // console.log("error",error);
        if (error) {
          return false
        } 
      }); 

      // console.log("info",info) 
    }


// Update a Quantity
exports.UpdateUserProducedInventoryData = async (req, res) => {
  //  console.log("req.body",req.body);
  try {
    let insufficientQuantity = false; // Flag to track if any item has insufficient quantity
    for (const buyItem of req.body.Products) {      
       const product = await UserProducedInventory.findOne({ _id: buyItem.id });
      //  console.log("req.body",product);
      if (product) {
        if (product.Quantity >= buyItem.Quantity) {
          const updatedQuantity = product.Quantity - buyItem.Quantity;
          await UserProducedInventory.updateOne(
            { _id: buyItem.id },
            { $set: { Quantity: updatedQuantity } }
          );
        } else {
          insufficientQuantity = true; // Set the flag to true if any item has insufficient quantity
        }
      } else {
        res.status(404).json(`Product "${buyItem.name}" not found in the database`);
        return; // Return early if a product is not found
      }
    }

    if (insufficientQuantity) {
      res.status(200).json('Not enough quantity available for one or more products');
    } else {
      let Billingdata = {
        ProductDetails:req.body.Products,
        ClientDetails:req.body.ClientDetails,
        BillNo: req.body.BillNo,
        BillingDate: req.body.BillingDate,
        SubTotal:req.body.SubTotal
   };
     const bill= await BillingInventory.create(Billingdata);
     console.log("before calling sendEmail",bill);
    //  let data =  SendEmail(bill); 
     console.log("Email Status", process.env.email , process.env.Toemail);
     let productRows = '';
     bill.ProductDetails.forEach((product) => {
       productRows += `
          <tr>
            <th style="border: 1px solid #ccc; padding: 8px;">${product.ProductName}</th>
            <th style="border: 1px solid #ccc; padding: 8px;">${product.Quantity}</th>
            <th style="border: 1px solid #ccc; padding: 8px;">${product.QuantityType}</th>
          </tr>
       `;
     });

    let mailOptions = {
      from: process.env.email,
      to: [process.env.Toemailadmin,process.env.Toemailchairman],
      subject: `New Dispatch From Warehouse`,
      html: `<h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Invoice Details</h2>
      <p style="margin-bottom: 10px;"><strong style="color: #555;">Client Name:</strong> ${bill.ClientDetails.ClientName}</p>
      <p style="margin-bottom: 10px;"><strong style="color: #555;">Client Address:</strong> ${bill.ClientDetails.ClientAddress}</p>
      <p style="margin-bottom: 10px;"><strong style="color: #555;">Bill No:</strong> ${bill.BillNo}</p>
      <p style="margin-bottom: 10px;"><strong style="color: #555;">Billing Date:</strong> ${bill.BillingDate}</p>
      <h3 style="color: #333; font-size: 20px; margin-bottom: 15px;">Product Details</h3>
      <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
        <thead>
          <tr style="background-color: #f2f2f2;">
            <th style="border: 1px solid #ddd; padding: 12px;">Product Name</th>
            <th style="border: 1px solid #ddd; padding: 12px;">Quantity</th>
            <th style="border: 1px solid #ddd; padding: 12px;">Quantity Type</th>
          </tr>
        </thead>
        <tbody>
          ${productRows}
        </tbody>
      </table>
      <p style="margin-top: 15px;" ><strong style="color: #555;" >Subtotal:</strong> ${bill.SubTotal}</p>
      
      `
    };
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.email,
        pass: process.env.password
      }  
    });

    transporter.sendMail(mailOptions, function(error, info) {
      // console.log("error",error);
      if (error) {
        return false
      } 
    });

      res.status(201).json({message:'Billing Created Successfully', data:bill, isSuccess:true });
    }   
  
     
  } catch (error) {
    console.log("error",error);
    res.status(500).json('Error updating quantities: ' + error);
  }

}

exports.GetAllDispatchForAdmin = (req,res)=>{
    BillingInventory.find().then((result)=>{
         res.status(200).json({
             message:"Get All Dispatch For Admin",
             data:result
         })
    })
    .catch(err=>{
          res.status(500).json({
              error:err,
              message:"error in database"
          })
    })
}

exports.DeleteDispatchForAdmin = (req,res)=>{
  // console.log("req",req.body);
  BillingInventory.deleteOne({ _id : req.body.id }).then((result)=>{
       res.status(200).json({
           message:"Dispact Bill Delete Successfully",
           data:result 
       })
  })
  .catch(err=>{
        res.status(500).json({
            error:err,
            message:"error in database"
        })
  })
}

async function getStatusForBillInventories() {
  try {
    // Step 1: Retrieve all documents from the "BillInventory" collection
    const billInventories = await BillingInventory.find();

    // Step 2: Iterate through each document
    for (const billInventory of billInventories) {
      // Extract the bill number from the current bill inventory
      const purchaseNo = billInventory.BillNo;

      // Query the "Billing" collection to find a document with matching purchase number
      const billingDocument = await Billing.findOne({ PurchaseNo: purchaseNo });
      // console.log("billingDocument == ",billingDocument);
      
      // Step 3: If a matching document is found, extract the CheckStatus
      if (billingDocument) {
        // Add the status to the current document from the "BillInventory" collection
        billInventory.status = billingDocument.CheckStatus;
      } else {
        // If no matching document is found, set the status to "PENDING"
        billInventory.status = "PENDING";
      }
    }

    // Return the modified documents from the "BillInventory" collection
    return billInventories;
  } catch (error) {
    // Handle any errors
    console.error("Error:", error);
    throw error;
  }
}

exports.GetDispatchAllDataHandler = async (req, res) => {
  try {
    // Fetch billing inventory documents with statuses
    const billInventoriesWithStatus = await getStatusForBillInventories();
    
    // Add status field to each document
    const result = billInventoriesWithStatus.map(bill => ({
      ...bill.toObject(), // Convert Mongoose document to plain JavaScript object
      status: bill.status // Include the status field
    }));

    // Send response
    res.status(200).json({
      message: "Get all dispatch documents",
      data: result
    });
  } catch (error) {
    // Handle any errors
    console.error("Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


