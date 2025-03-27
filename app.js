require('dotenv').config()
require('express-async-errors')
const express=require('express')
const app=express()
const errorHandlerMiddleware=require('./middleware/error-handler')
const NotFoundErrorMiddlerWare=require('./middleware/not-found')
const authMiddleWare=require('./middleware/authentication')
const jobsRouter=require('./routes/jobs')
const usersRouter=require('./routes/user')
const connectDB=require('./db/connect')
const xss=require('xss-clean')
const cors=require('cors')
const helmet=require('helmet')
const rateLimiter=require('express-rate-limit')

app.set('trust proxy',1)
app.use(rateLimiter({
    windowMs:15 * 60 *1000,//15 minutes
    max:100,
}))
app.use(express.json())
app.use(helmet())
app.use(cors())
app.use(xss())

app.get('/',(req,res)=>{
    res.json('hello user')
})
app.use('/api/v1/users',usersRouter)
app.use('/api/v1/jobs',authMiddleWare,jobsRouter)

app.use(errorHandlerMiddleware)
app.use(NotFoundErrorMiddlerWare)


const port=process.env.PORT || 3000
const start=async()=>{
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port,()=>console.log(`Server is Listening on port ${port}`)
        )
    } catch (error) {
        console.log(error);
        
    }
}
start()

