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

const updateUser = async (req, res, next) => {
    try {
        const { email, name,newName, newEmail, password, newPassword } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            throw new BadRequestError('User not found');
        }

        // Check if updating email
        if (newEmail) {
            if (newEmail !== email) {
                const emailExists = await User.findOne({ email: newEmail });
                if (emailExists) {
                    throw new BadRequestError('Email already in use');
                }
                user.email = newEmail;
            }
        }

        // Password update logic
        if (newPassword) {
            if (!password) {
                throw new BadRequestError('Current password is required to set a new password');
            }
            
            const isPasswordCorrect = await user.comparePassword(password);
            if (!isPasswordCorrect) {
                throw new BadRequestError('Current password is incorrect');
            }
            user.password = newPassword;
        }

        if (newName) user.name = newName;
        
        await user.save(); // Save all changes
        
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        
        res.status(StatusCodes.OK).json({ user: userWithoutPassword });
    } catch (error) {
        next(error);
    }
};
module.exports={register,login,updateUser}