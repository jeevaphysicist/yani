const Usercollection = require('../Models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


// Signup
exports.signup = async(req,res)=>{
  // console.log("data",req.body);
            let { Email,Password,UserName,Role } = req.body;
            if(!Password || !Email || !UserName || !Role ){
              return res.status(400).json({ message:"Please fill the fields" , isSuccess:false })
        }
            let filter = {Email:Email};
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(Password , salt);
                  Password = hash ;
            let count = await Usercollection.find(filter).count()
            if(count === 0){
                let data={
                       UserName:UserName,
                       Email,
                       Password,
                       Role
                    };
        // console.log("process.env.email",process.env.email);
               Usercollection.create(data).then(result=>{           
                res.status(201).json({ message:"SignUp Successfully",isSuccess:true })
               })
               .catch(err=>{
                     res.status(505).json({ message:"Error in database", Error:err , isSuccess:false})
                    })
            }
            else{
                res.status(200).json({ message:"User Already Exist Please Continue Login", isSuccess:false})
            }
}


// login
exports.login = async(req,res)=>{
    let {Email,Password} = req.body;
  //  console.log("req.body",Email);
    let filter  = { Email : Email };
    let count = await Usercollection.find(filter).count();
    // console.log("Count",count)
    if(count === 0){
        res.status(404).json({ message:"User Not Exist Please continue Signup" ,login:false  });
    }
    else{
     Usercollection.find(filter)
     .then(result=>{
      //  console.log("result",result);
       
         bcrypt.compare(Password, result[0].Password,(err,response)=>{
           if(response){               
             const token = jwt.sign({ Email: result[0].Email, Role:result[0].Role,isloggedin:true ,id:result[0]._id }, "vnvrvrvnvjjvnfjvfjv");
             res.cookie('token', token, { expires: new Date(Date.now() + 900000), httpOnly: true }).status(201).json({ login: true, token });
           }
           else{
             return res.json({ login: false, message: 'Invalid  password' });
           }
     });           
     })
     .catch(error=>{
       res.status(505).json({ message:"Error in Database" ,login:false ,error:error  })
     })
    }
}

exports.UpdateUser = async (req,res)=>{
  // console.log("data",req.body);
  let data = {};
            let { Email, Password , UserName ,Role, id} = req.body;
            // console.log("!Password && !Email && !UserName && !Role && !id",)
            if( !Email || !UserName || !Role || !id ){
              return res.status(400).json({ message:"Please fill the fields" , isSuccess:false })
             }
             else{
                data.UserName = UserName;
                data.Role = Role;
                data.Email = Email;
             }
             if(Password){
              const salt = await bcrypt.genSaltSync(10);
              const hash = await bcrypt.hashSync(Password , salt);
                    data.Password = hash ;
             }
            let filter = {Email:Email};
            let count = await Usercollection.find(filter).count();
            
            
            
            if(count === 1){ 
               
        // console.log("process.env.email",process.env.email);
               Usercollection.updateOne({_id:id},data).then(result=>{           
                res.status(201).json({ message:"User Data Update Successfully",isSuccess:true })
               })
               .catch(err=>{
                     res.status(505).json({ message:"Error in database", Error:err , isSuccess:false})
                    })
            }
            else{
                res.status(200).json({ message:"User Not Exist ", isSuccess:false})
            }
}

exports.deleteUser = async (req,res)=>{
  // console.log(req.params.id)
  Usercollection.deleteOne({ _id: req.params.id })
  .then(result => {
      res.status(200).json({ message: "Delete Product Successfully" ,isSuccess:true});
  })
  .catch(err => {
      res.status(500).json({ message: "Error in database", error: err ,isSuccess:false});
  });

}

// GET USER
exports.getallusers = async(req,res)=>{
  let filter = {};
   if(req.params.query === "All"){
      filter = {};
   }
   if(req.params.query === "Admin"){
     filter = {Role:"Admin"};
  }
  if(req.params.query === "User"){
     filter = {Role:"User"};
  }

  let count = await Usercollection.find().count();
   Usercollection.find(filter,{Password:0})
   .then(result=>{ 
           res.status(200).json({ data: result ,TotalUser:count });     
   })
   .catch(error=>{
     res.status(505).json({ message:"Error in Database"  ,error:error  })
   })
}