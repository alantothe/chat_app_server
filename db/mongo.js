import mongoose from 'mongoose'

mongoose.set("returnOriginal", fasle)

//add .env here

mongoose.connect("mongodb://localhost:27017//ChatDB").catch((err)=> {
    console.error(err)
console.log("Error connecting to Database", err)

})

mongoose.connection.on("connected", () => {
    console.log("Successfully connected to MongoDB")
})

mongoose.connection.on("disconnected", () => {
    console.log("Discconected from MongoDB")

})

mongoose.connection.on("error", (err) => {
    console.log(`MongoDB connection error: ${err}`);
});

export default mongoose.connection

