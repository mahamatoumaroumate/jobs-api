const mongoose=require('mongoose')
const jobSchema=new mongoose.Schema({
    company:{
        type:String,
        required:[true,'please provide the company value'],
        minlength:3,
        maxlength:50
    },
    position:{
        type:String,
        required:[true,'please provide the position value'],
        minlength:3,
        maxlength:100
    },
    status:{
        type:String,
        enum:['pending','declined','interview'],
        default:'pending'
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:[true,'please provide the user']
    }

},{timestamps:true})
module.exports=mongoose.model('Job',jobSchema)