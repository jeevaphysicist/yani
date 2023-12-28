const Billings = require('../Models/Billing');
const BillingInventory = require('../Models/BillInventory');

exports.GetDashBoardData = async (req,res)=>{
        console.log("date",req.body);
        const startDate = new Date('2023-12-17T00:00:00.000Z');
        const endDate = new Date('2023-12-23T23:59:59.999Z');
        const targetDate = new Date('2023-12-23T00:00:00.000Z');
         let data = await Billings.aggregate([
           
            {
              $group: {
                _id: null,
                totalAmount: { $sum: "$Price" },
                pendingAmount: {
                  $sum: {
                    $cond: {
                      if: { $eq: ["$CheckStatus", "PENDING"] },
                      then: "$Price",
                      else: 0
                    }
                  }
                },
                completedAmount: {
                  $sum: {
                    $cond: {
                      if: { $eq: ["$CheckStatus", "COMPLETED"] },
                      then: "$Price",
                      else: 0
                    }
                  }
                },
                totalBills: { $sum: 1 }, // Count the total number of bills
                pendingCount: {
                  $sum: {
                    $cond: {
                      if: { $eq: ["$CheckStatus", "PENDING"] },
                      then: 1,
                      else: 0
                    }
                  }
                },
                completedCount: {
                  $sum: {
                    $cond: {
                      if: { $eq: ["$CheckStatus", "COMPLETED"] },
                      then: 1,
                      else: 0
                    }
                  }
                },
                latestBills: { $push: "$$ROOT" } // Push the entire document into the latestBills array
              }
            },
            {
              $addFields: {
                latestBills: { $slice: ["$latestBills", -10] }, // Get the last 10 bills
                pendingPercentage: { $multiply: [{ $divide: ["$pendingAmount", "$totalAmount"] }, 100] },
                completedPercentage: { $multiply: [{ $divide: ["$completedAmount", "$totalAmount"] }, 100] }
              }
            }
          ]);

        //   console.log("data",data);
          return res.status(200).send({data:data[0]});
          
         
}