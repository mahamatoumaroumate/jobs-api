const bcrypt=require('bcryptjs')
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'please provide the name'],
        minlength:3,
        maxlength:50,
    },
    email:{
        type:String,
        required:[true,'please provide the email'],
        match: [
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            'Please provide a valid email',
          ],
          unique: true,
    },
    password:{
        type:String,
        required:[true,'please provide the password'],
        minlength:8,
    },
})

userSchema.pre('save',async function(){
    const salt=await bcrypt.genSalt(10)
    this.password=await bcrypt.hash(this.password,salt)
}
)
userSchema.methods.comparePassword=async function(password){
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.createJWT=function(){
return jwt.sign({name:this.name,userId:this._id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_LIFETIME})
}

module.exports=mongoose.model('User',userSchema)