const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

// Import Routes
const AuthRoutes = require('./routes/User'); 
const FarmInventoryRoutes = require('./routes/FarmInventory');
const ProducedInventoryRoutes = require('./routes/ProducedInventory');
const UserFarmInventoryRoutes = require('./routes/UserFarmInventory');
const UserProducedInventoryRoutes = require('./routes/UserProducedInventory');
const ClientInventoryRoutes = require('./routes/ClientInvetory');
const Billing = require('./routes/Billing');   
    
const app = express(); 
const PORT = process.env.PORT || 8080 ;
const allowedOrigins = ['http://localhost:3000',"https://yanilanka.netlify.app",'https://inventory-h9o9.onrender.com'];

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({limit:"50mb"}));
app.use(cors({ origin: allowedOrigins }));


// Database connection 
mongoose.connect(process.env.MONGOURI);

mongoose.connection.once("open", () => {
  console.log("database connected successfully");
});

mongoose.connection.on("connected", () => {
  console.log("mongodb connected");
});

mongoose.connection.on("disconnected", () => {
  console.log("mongodb disconnected");
});

app.get('/',(req,res)=>{
  res.status(200).json({ message : 'Server Running Successfully' });
})
 

// API Paths
// User routes
app.use('/api/auth',AuthRoutes);
// Farm Inventory Routes 
app.use('/api/farminventory',FarmInventoryRoutes);
// Produced Inventory Routes 
app.use('/api/Producedinventory',ProducedInventoryRoutes);
// Client Inventory Routes
app.use('/api/clientinventory',ClientInventoryRoutes);
// Billing Routes
app.use('/api/billing',Billing);      
// User Farm Inventory Routes
app.use('/api/userfarminventory',UserFarmInventoryRoutes);
// User Produced Inventory Routes
app.use('/api/userproducedinventory',UserProducedInventoryRoutes);

 
 
app.listen(PORT,()=>{
   console.log("server running on port ",PORT);
})
  