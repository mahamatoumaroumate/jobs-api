const express=require('express')
const router=express.Router()
const {login,updateUser,register}=require('../controllers/users')

router.post('/login',login)
router.post('/register',register)
router.patch('/update',updateUser)
module.exports=router