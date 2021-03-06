const Job=require('../models/Job')
const {StatusCodes}=require('http-status-codes')
const {NotFoundError, BadRequestError}=require('../errors')

const getAllJobs=async(req,res)=>{
   console.log(1)
    const jobs= await Job.find({createdBy:req.user.userId}).sort('createdAt')
    res.status(StatusCodes.OK).json({jobs,count:jobs.length})
}



const createJob=async(req,res)=>{
      console.log(2)
    req.body.createdBy=req.user.userId  // adding to the body the object id of the user created to the created by schema of Job
    const job=await Job.create(req.body)
    res.status(StatusCodes.CREATED).json({ job })
    
}


const getJob = async (req, res) => {

  console.log(13)
  const {
    user: { userId },
    params: { id: jobId },
  } = req

  const job = await Job.find({
    _id: jobId,
    createdBy: userId,
  })

  if (!job) {
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job })
}



const updateJob=async(req,res)=>{
    const {
            body:{company,position},
            user:{userId},
            params:{id:jobId},
          }=req
          

          if(company==='' || position==='')
          {
              throw new BadRequestError('Company or Position fields can not be empty')
          }
          // mongoose update validators must be set true thy are off by default 
          const job= await Job.findByIdAndUpdate({_id:jobId,createdBy:userId},
                                                    req.body,
                                                    {new:true,runValidators:true}
                                                )
          if(!job)
          {
            console.log({jobId})
             throw new NotFoundError(`No job with id ${jobId}`)
          }
          res.status(StatusCodes.OK).json({job})


}

const deleteJob=async(req,res)=>{

    const  {
             user:{userId}, 
             params:{id:jobId},
           }=req
        
        const job=await Job.findByIdAndRemove({
                _id:jobId,
                 createdBy:userId,  
        })
      
        if(!job)
        {
           throw new NotFoundError(`No job with id ${jobId}`)
        }
    
        res.status(StatusCodes.OK).send()

    
}


module.exports={getAllJobs,getJob,createJob,updateJob,deleteJob,}