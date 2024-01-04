const Billing = require('../Models/Billing');

function generateShortId() {
  const characters = '0123456789';
  let shortId = '';

  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortId += characters.charAt(randomIndex);
  }

  return shortId;
}

// Create a bill
exports.createBills = (req,res)=>{  
  const uniqueShortId = generateShortId();
    let data = { 
        Date:req.body.Date,
        GRNRGN:req.body.GRNRGN,
        ProductID:req.body.ProductID,
        ProductName:req.body.ProductName,
        Price:req.body.Price,
        Quantity:req.body.Quantity,
        CheckNo:req.body.CheckNo,
        BankInDate:req.body.BankInDate,
        CheckAmount:req.body.CheckAmount,
        CheckStatus:"PENDING",
        OrderNumber: uniqueShortId,
        TotalAmount:req.body.TotalAmount
      };
      // console.log("data",data); 

      // Validate the incoming data
      if(!data.Date || !data.GRNRGN||!data.ProductID||!data.ProductName||!data.Price || !data.Quantity || !data.OrderNumber){
        return res.status(400).json({message:'Please include all fields'});
      }

      if(data.CheckAmount || data.CheckNo || data.BankInDate){      
      if(data.CheckAmount && data.CheckNo && data.BankInDate){
         data.CheckStatus = "COMPLETED";
      }
      else{
         data.CheckStatus = "PENDING";
       }
    }

    Billing.create(data).then(result=>{
        res.status(201).json({message:"Bill Created Succesfully",data:result,isSuccess:true})
 })
 .catch(err=>res.status(500).json({ error : err , message:"error in database" }));          
} 


// Get  a Billing data
exports.GetBillingData = (req,res)=>{
   let filter ={};
      if(req.params.query === "ALL"){
          filter={};
      }
      if(req.params.query === "COMPLETED")
         filter.CheckStatus = "COMPLETED"
      if(req.params.query === "PENDING")
         filter.CheckStatus = "PENDING"

    Billing.find(filter).then(result=>{
        res.status(201).json({message:"Get  Billing Data Succesfully",data:result})
 })
 .catch(err=>res.status(500).jons({ error : err , message:"error in database" }));          
} 

exports.updateBilling = async (req,res)=>{
  let data = req.body ;
   data.CheckStatus = "PENDING"
  //  console.log("data",data);
  if(data.CheckAmount || data.CheckNo || data.BankInDate){      
    if(data.CheckAmount && data.CheckNo && data.BankInDate){
       data.CheckStatus = "COMPLETED";
    }
    else{
       data.CheckStatus = "PENDING";
     }
  }
 
     Billing.updateOne( { _id:req.body.id } , data).then(result=>{
         res.status(200).json({ message:"Document Update Successfully",data:result ,isSuccess:true })   
     })
     .catch(err=>{
      res.status(500).json({message:"error in database",error:err})
     })
}

// Update A Billing Data
// Create a bill
exports.updateBillings = async (req, res) => {
  const billsToUpdate = req.body.bills; // Assuming the bills array is in req.body
  // console.log("bills", req.body.bills);

  // Validate the incoming data
  if (!billsToUpdate || !Array.isArray(billsToUpdate) || billsToUpdate.length === 0) {
    return res.status(400).json({ message: 'Please provide an Note to update' });
  }

  const updatePromises = billsToUpdate.map(async (bill) => {
    const filter = {
      _id: bill._id
    };
   

    const update = {
      $set: {
        Date: bill.Date,
        GRNRGN: bill.GRNRGN,
        ProductID: bill.ProductID, // Corrected field name based on the schema
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
        update.$set.CheckStatus = 'PENDING';
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

exports.deleteBillings = async (req,res)=>{
       console.log(req.params.id)
       Billing.deleteOne({ _id: req.params.id })
       .then(result => {
           res.status(200).json({ message: "Delete Product Successfully" ,isSuccess:true});
       })
       .catch(err => {
           res.status(500).json({ message: "Error in database", error: err });
       });

}



