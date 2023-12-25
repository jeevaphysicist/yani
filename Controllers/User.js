const Usercollection = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Signup
exports.signup = async(req,res)=>{
  // console.log("data",req.body);
            let { Email,Password,UserName,Role } = req.body;
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
                res.status(201).json({ message:"SignUp Successfully",signup:true })
               })
               .catch(err=>{
                     res.status(505).json({ message:"Error in database", Error:err , signup:false})
                    })
            }
            else{
                res.status(200).json({ message:"User Already Exist Please Continue Login", signup:false})
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