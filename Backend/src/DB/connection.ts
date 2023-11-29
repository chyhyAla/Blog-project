import mongoose from "mongoose"


export  const connectDb = (url: string)=>{
    return mongoose.connect(url , {
        
    })
}



