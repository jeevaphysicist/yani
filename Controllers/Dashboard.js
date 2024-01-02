const Billings = require('../Models/Billing');
const BillingInventory = require('../Models/BillInventory');

exports.GetDashBoardData = async (req,res)=>{
        let filter = {} ;         
        if(req.body.startDate && req.body.endDate){
          const startDate = new Date(req.body.startDate);
          const endDate = new Date(req.body.endDate);
          const staredDate = startDate.toISOString().split('T')[0];
          const endedDate = endDate.toISOString().split('T')[0];
          filter = {
            Date: {
              $gte: staredDate,
              $lte: endedDate,
            },
          };
        }
        console.log("date",req.body);
        console.log("filter",filter);
        
         let data = await Billings.aggregate([
          {
            $match: filter
          },
            {
              $group: {
                _id: null,
                totalAmount: { $sum: { $multiply: ["$Quantity", "$Price"] } },
                pendingAmount: {
                  $sum: {
                    $cond: {
                      if: { $eq: ["$CheckStatus", "PENDING"] },
                      then: { $multiply: ["$Quantity", "$Price"] },
                      else: 0
                    }
                  }
                },
                completedAmount: {
                  $sum: {
                    $cond: {
                      if: { $eq: ["$CheckStatus", "COMPLETED"] },
                      then: { $multiply: ["$Quantity", "$Price"] },
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


// Updated code to fetch positive and negative quantities along with additional fields for each product
exports.GetProductQuantities = async (req, res) => {
  let filter = {} ;         
        if(req.body.startDate && req.body.endDate){
          const startDate = new Date(req.body.startDate);
          const endDate = new Date(req.body.endDate);
          const staredDate = startDate.toISOString().split('T')[0];
          const endedDate = endDate.toISOString().split('T')[0];
          filter = {
            Date: {
              $gte: staredDate,
              $lte: endedDate,
            },
          };
        }
  try {
    let data = await Billings.aggregate([
       {
        $match: filter
       },
       {
        $group: {
          _id: "$ProductID",
          totalPositiveQuantity: {
            $sum: {
              $cond: {
                if: { $gte: ["$Quantity", 0] },
                then: "$Quantity",
                else: 0,
              },
            },
          },
          totalNegativeQuantity: {
            $sum: {
              $cond: {
                if: { $lt: ["$Quantity", 0] },
                then: "$Quantity",
                else: 0,
              },
            },
          },
          // Add additional fields you want to include in the result
          totalAmount: { $sum: { $multiply: ["$Quantity", "$Price"] } },
          // Add more fields as needed
        },
      },
      {
        $lookup: {
          from: "ProducedInventory",
          localField: "_id",
          foreignField: "ProductID",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $project: {
          _id: 1,
          ProductName: "$productDetails.ProductName",
          ProductID: "$productDetails.ProductID",
          totalPositiveQuantity: 1,
          totalNegativeQuantity: 1,
          // Include additional fields in the result
          totalAmount: 1,
          // Include more fields as needed
        },
      },
    ]);

    console.log("data", data);

    return res.status(200).send({ data: data });
  } catch (error) {
    console.error("Error fetching data:", error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};
