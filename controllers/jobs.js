const Job=require('../models/Job')
const {NotFoundError,BadRequestError}=require('../errors')
const {StatusCodes}=require('http-status-codes')

const createJob=async(req,res)=>{
    req.body.createdBy=req.user.userId
    const job=await Job.create({...req.body})
    res.status(StatusCodes.CREATED).json({job})
}
const getAllJobs = async (req, res) => {
  try {
    const { sort, search, status, page = 1, limit = 12 } = req.query;

    const queryObject = {
      createdBy: req.user.userId,
    };

    if (search) {
      queryObject.position = { $regex: search, $options: 'i' };
    }

    if (status && status !== 'all') {
      queryObject.status = status;
    }

    const totalJobs = await Job.countDocuments(queryObject);

    let mongoQuery = Job.find(queryObject); // only build here

    // Sort
    switch (sort) {
      case 'a-z':
        mongoQuery = mongoQuery.sort({ company: 1 });
        break;
      case 'z-a':
        mongoQuery = mongoQuery.sort({ company: -1 });
        break;
      case 'latest':
        mongoQuery = mongoQuery.sort({ createdAt: -1 });
        break;
      default:
        mongoQuery = mongoQuery.sort({ createdAt: 1 });
    }

    // Pagination
    const skip = (Number(page) - 1) * Number(limit);
    mongoQuery = mongoQuery.skip(skip).limit(Number(limit));

    // ✅ Execute query only once
    const jobs = await mongoQuery;

    res.status(200).json({
      jobs,
      totalJobs,
      numOfPages: Math.ceil(totalJobs / limit),
    });
  } catch (error) {
    console.error("🔥 Backend error in getAllJobs:", error);
    res.status(500).json({ msg: error.message });
  }
};
const getJobsStats=async(req,res)=>{
const jobs=await Job.find({createdBy:req.user.userId})
res.status(StatusCodes.OK).json({jobs})
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
module.exports={createJob,deleteJob,getAllJobs,getJob,updateJob,getJobsStats}