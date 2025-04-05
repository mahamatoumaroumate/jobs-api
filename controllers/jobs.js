const Job=require('../models/Job')
const {NotFoundError,BadRequestError}=require('../errors')
const {StatusCodes}=require('http-status-codes')

const createJob=async(req,res)=>{
    req.body.createdBy=req.user.userId
    const job=await Job.create({...req.body})
    res.status(StatusCodes.CREATED).json({job})
}
const getAllJobs=async(req,res)=>{
let queryObject={}
queryObject.createdBy=req.user.userId
const {sort,search,status}=req.query
   if(search){
      queryObject.position={$regex:search,$options:'i'}
   }if(status && status!=='all'){
       queryObject.status=status
   }
   let result= Job.find(queryObject)
   
   if(sort){
    if(sort==='a-z'){
        result=result.sort({company:1})
    }else if(sort==='z-a'){
        result=result.sort({company:-1})

    }else if(sort==='latest'){
        result=result.sort({createdAt:-1})

    }
    else{
        result=result.sort({createdAt:1})

    }
}
const length=(await result).length
const page=Number(req.query.page)||1
const limit=Number(req.query.limit)||12
const skip=(page-1)*limit
result=result.skip(skip).limit(limit)
const jobs=await result

    res.status(StatusCodes.OK).json({jobs,length})
}
const getJob=async(req,res)=>{
    const{user:{userId:createdBy},params:{id:jobId}}=req
    const job=await Job.findOne({createdBy,_id:jobId})
    res.status(StatusCodes.OK).json({job})
}
const updateJob=async(req,res)=>{
    const {company,position}=req.body
    if(!company && !position){
        throw new BadRequestError('Please provide the company or position')
    }
    const{user:{userId:createdBy},params:{id:jobId}}=req
    const job=await Job.findByIdAndUpdate({createdBy,_id:jobId},req.body,{new:true,runValidators:true})
    res.status(StatusCodes.OK).json({job})
}
const deleteJob=async(req,res)=>{
    const{user:{userId:createdBy},params:{id:jobId}}=req
    const job=await Job.findByIdAndDelete({createdBy,_id:jobId})
    res.status(StatusCodes.OK).json(job)
}
module.exports={createJob,deleteJob,getAllJobs,getJob,updateJob}