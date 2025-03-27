const NotFoundErrorMiddlerWare=(err,req,res,next)=>{
    res.status(404).json({msg:"Route Does not Exist"})
}
module.exports=NotFoundErrorMiddlerWare