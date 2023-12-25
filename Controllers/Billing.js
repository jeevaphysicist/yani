const Billing = require('../Models/Billing');

// Create a bill
exports.createBills = (req,res)=>{  
    let data = { 
        Date:req.body.Date,
        GRNRGN:req.body.GRNRGN,
        Itemcode:req.body.Itemcode,
        ProductName:req.body.ProductName,
        Price:req.body.Price,
        Quantity:req.body.Quantity,
        CheckNo:req.body.CheckNo,
        BankInDate:req.body.BankInDate,
        CheckAmount:req.body.CheckAmount,
        CheckStatus:"PENDING",
      };

      // Validate the incoming data
      if(!data.Date || !data.GRNRGN||!data.Itemcode||!data.ProductName||!data.Price || !data.Quantity){
        return res.status(400).json({msg:'Please include all fields'});
      }

      if(data.CheckAmount || data.CheckNo || data.BankInDate){      
      if(data.CheckAmount && data.CheckNo && data.BankInDate){
         data.CheckStatus = "COMPLETED";
      }
      else{
         data.CheckStatus = "PENDING_BID";
       }
    }

    Billing.create(data).then(result=>{
        res.status(201).json({message:"Bill Created Succesfully",data:result,isSuccess:true})
 })
 .catch(err=>res.status(500).json({ error : err , message:"error in database" }));          
} 


// Get  a Billing data
exports.GetBillingData = (req,res)=>{
    Billing.find().then(result=>{
        res.status(201).json({message:"Get  Billing Data Succesfully",data:result})
 })
 .catch(err=>res.status(500).jons({ error : err , message:"error in database" }));          
} 

// Update A Billing Data
// Create a bill
exports.updateBillings = async (req, res) => {
  const billsToUpdate = req.body.bills; // Assuming the bills array is in req.body
   console.log("bills",req.body.bills);
  // Validate the incoming data
  if (!billsToUpdate || !Array.isArray(billsToUpdate) || billsToUpdate.length === 0) {
    return res.status(400).json({ msg: 'Please provide an array of bills to update' });
  }

  const updatePromises = billsToUpdate.map(async (bill) => {
    const filter = {
      Date: bill.Date,
      GRNRGN: bill.GRNRGN,
      Itemcode: bill.Itemcode,
      ProductName: bill.ProductName,
      Price: bill.Price,
      Quantity: bill.Quantity,
      // Add more conditions as needed
    };

    const update = {
      $set: {
        Date: bill.Date,
        GRNRGN: bill.GRNRGN,
        Itemcode: bill.Itemcode,
        ProductName: bill.ProductName,
        Price: bill.Price,
        Quantity: bill.Quantity,
        CheckNo: bill.CheckNo,
        BankInDate: bill.BankInDate,
        CheckAmount: bill.CheckAmount,
      },
    };

    if (update.$set.CheckAmount || update.$set.CheckNo || update.$set.BankInDate) {
      if (update.$set.CheckAmount && update.$set.CheckNo && update.$set.BankInDate) {
        update.$set.CheckStatus = 'COMPLETED';
      } else {
        update.$set.CheckStatus = 'PENDING_BID';
      }
    }

    try {
      return await Billing.updateMany(filter, update);
    } catch (err) {
      throw err; // Propagate the error for better error handling
    }
  });

  try {
    const results = await Promise.all(updatePromises);
    res.status(201).json({ message: 'Bills Updated Successfully', data: results, isSuccess: true });
  } catch (err) {
    res.status(500).json({ error: err, message: 'Error in database' });
  }
};



