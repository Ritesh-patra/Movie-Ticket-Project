import mongoose from "mongoose";

const connectDb = async () => {
    try {
        mongoose.connection.on('connected', () => console.log('Database connected')
         )
        await mongoose.connect(`${process.env.MONGODB_URL}/quickShow`)
    } catch (error) {
        console.log(error)
    }
}

export default connectDb;