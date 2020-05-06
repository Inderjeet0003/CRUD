const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost:27017/EmployeeDB',{useNewUrlParser: true, useUnifiedTopology: true},(error)=>{
    if(!error)  console.log('Mongodb connection successfull') 
    else { console.log('Error in DB connection' + err)}
})