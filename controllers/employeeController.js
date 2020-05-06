
const express= require('express')
var router = express.Router()
const mongoose=require('mongoose')
const path=require('path')
const Employee = require('../models/employee.model.js');
// const Employee =require('employee.model');
// const Employee = mongoose.model('Employee'); 

router.get('/',(req,res)=>{
    res.render('employee/addOrEdit',{
        viewTitle:"Insert Employee"
    })
})
router.post('/',(req,res)=>{
    // console.log(req.body)
    if(req.body._id == '')
    insertRecord(req,res)
    else
    updateRecord(req,res)
   
})
 function insertRecord(req,res){
    var employee = new Employee()
    employee.fullName = req.body.fullName;
    employee.email = req.body.email;
    employee.mobile = req.body.mobile;
    employee.city = req.body.city;
    // await employee.save((err,doc)=>{
    //     if(!err) res.redirect('employee/list')
    //     else {
    //         console.log('ERROR in Insertion:'+err)
    //     }
    // })
    
    employee.save().then(doc =>{
        console.log(doc)
        res.redirect('employee/list')
    })
    .catch(err=>{
        console.log(err)
        if(err.name == 'ValidationError')
          {
               handleValidationError(err,req.body)
                res.render('employee/addOrEdit',{
                viewTitle:"Insert Employee",
                employee :req.body
            })
           }
        else{
            console.log('Error during record Insertion : '+ err)
        }

    })
}

router.get('/list',(req,res)=>{
//   res.json('from list')
  Employee.find((err,docs)=>{
      if(!err){
          res.render("employee/list",{
             list : docs 
          })
      }
    //   console.log(docs)
      else{
          console.log('Error in retrieving employee list:'+ err)
      }
  }).lean()
    //  Employee.findById(('5ea286e007dca90e0c0ad30a')).lean().exec((err,docs)=>{
    //      if(!err){
    //          res.render('employee/list',{
    //              list : docs
    //          })
    //      }
    //      else
    //      {
    //          console.log('Error in retriving employee list:'+err)
    //      }
    //  })


})

function handleValidationError(err,body){
    for(field in err.errors)
    {
        switch(err.errors[field].path){
            case 'fullName':
                body['fullNameError'] = err.errors[field].message;
                break;
                case 'email':
                    body['emailError'] = err.errors[field].message;
                    break;
                default: break;
        }
    }
}

function updateRecord(req,res){
    Employee.findOneAndUpdate({_id:req.body._id},req.body,{new : true,useFindAndModify: false },(err,doc) =>{
        if(!err) { res.redirect('employee/list')}
        else {
            if(err.name=='ValidationError'){
                handleValidationError(err,req.body)
                res.render("employee/addorEdit",{
                    viewTitle:'Update Employee Details',
                    employee :req.body
                })
            }
            else 
            console.log('Error during Updation :'+err)
        }
    }).lean()
}



router.get('/:id',(req,res)=>{
Employee.findById(req.params.id,(err,doc)=>{
    if(!err){
        res.render("employee/addorEdit",{
            viewTitle : "Update Employee Details",
            employee:doc
        })
    }
   
}).lean()
})

router.get('/delete/:id',(req,res)=>{
    Employee.findByIdAndRemove(req.params.id,(err,doc)=>{
        if(!err) {
            res.redirect('/employee/list')
        }
        else 
        console.log('Error in employee delete:'+err)
    })
})

module.exports= router

