const mongoose = require('mongoose')

var employeeSchema = new mongoose.Schema({
    fullName :{
        type:String,
        required:'This field is required'
    },
    email :{
        type:String,
        unique:true,
        required:'This field must be filled',
        validate: {
            
            validator: function(value, isValid) {
                const self = this;
                return self.constructor.findOne({ email: value })
                .exec(function(err, user){
                    if(err){
                        throw err;
                    }
                    else if(user) {
                        if(self.id === user.id) {  // if finding and saving then it's valid even for existing email
                            return isValid(true);
                        }
                        return isValid(false);  
                    }
                    else{
                        return isValid(true);
                    }

                })
            },
            message:  'The email address is already taken!'
        }
      
    },
    mobile:{
        type:Number,
        required:'This field is required'
    },
    city:{
        type:String,
        required:'This field is required'
    }
})
employeeSchema.path('email').validate((val)=>{
    emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(val);
},'Invalid E-MAIL')
// const Employee = mongoose.model('employee',employeeSchema);

// Export the model
module.exports = mongoose.model('employee',employeeSchema)