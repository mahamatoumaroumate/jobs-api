const {StatusCodes}=require('http-status-codes')
const BadRequestError=require('../errors/BadRequestError')
const User=require('../models/User')
const bcrypt=require('bcryptjs')
const register=async(req,res)=>{
    const {password}=req.body
    const user=await User.create({...req.body})
    const token=user.createJWT()
    res.status(StatusCodes.CREATED).json({user,token})
}
const login=async(req,res)=>{
    const {email,password}=req.body
    if(!email || !password){
        throw new BadRequestError('please provide the email and password')
    }
    const user=await User.findOne({email})
    if(!user){
        throw new BadRequestError('incorrect  email')
    }
    const isPasswordEqual=await user.comparePassword(password)
    if(!isPasswordEqual){
        throw new BadRequestError('incorrect  password')
    }
    const token=user.createJWT()
    res.status(StatusCodes.OK).json({user,token})
}

const updateUser=async(req,res)=>{
    const {email,password,name,newName,newEmail,newPassword}=req.body
    if(!email || !password){
        throw new BadRequestError('please provide the email and password')
    }
    const user=await User.findOne({email})
    if(!user){
        throw new BadRequestError('incorrect  email ')
    }
    const isPasswordEqual=await user.comparePassword(password)
    if(!isPasswordEqual){
        throw new BadRequestError('incorrect  password')
    }
    if(newEmail)user.email=newEmail
    if(newName)user.name=newName
    if(newPassword){
        const salt=await bcrypt.genSalt(10)
        user.password=await bcrypt.hash(newPassword,salt)
    }
    await user.save()
    res.status(StatusCodes.OK).json({user})
}
module.exports={register,login,updateUser}