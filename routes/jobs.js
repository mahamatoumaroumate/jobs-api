const express=require('express')
const router=express.Router()
const{createJob,deleteJob,getAllJobs,getJob,updateJob}=require('../controllers/jobs')
const { model } = require('mongoose')
router.get('/',getAllJobs).post('/',createJob)
router.get('/:id',getJob).patch('/:id',updateJob).delete('/:id',deleteJob)
module.exports=router