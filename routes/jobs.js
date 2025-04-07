const express=require('express')
const router=express.Router()
const{createJob,deleteJob,getJobsStats,getAllJobs,getJob,updateJob}=require('../controllers/jobs')
router.get('/stats',getJobsStats)
router.get('/',getAllJobs).post('/',createJob)
router.get('/:id',getJob).patch('/:id',updateJob).delete('/:id',deleteJob)
module.exports=router