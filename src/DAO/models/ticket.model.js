import mongoose from "mongoose";
const ticketsCollection = "tickets"

const ticketsSchema = mongoose.Schema({
    code: String,
    purchase_datetime: Date,
    amount: Number,
    purchaser: String
})

export default mongoose.model(ticketsCollection, ticketsSchema)