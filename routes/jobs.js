const express=require('express')
const router=express.Router()
const{createJob,deleteJob,getJobsStats,getAllJobs,getJob,updateJob}=require('../controllers/jobs')
router.get('/',getAllJobs).post('/',createJob)
router.get('/:id',getJob).patch('/:id',updateJob).delete('/:id',deleteJob)
router.get('/stats',getJobsStats)
module.exports=router