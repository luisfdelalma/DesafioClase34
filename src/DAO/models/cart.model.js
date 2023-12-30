import mongoose from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const cartsCollection = "carts"
const cartsSchema = mongoose.Schema({
    CId: Number,
    products: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "products" },
            quantity: { type: Number, default: 1 }
        }
    ],
    user: { type: mongoose.Schema.Types.ObjectId, ref: "aut-users", index: true }

})

cartsSchema.pre("findOne", function () {
    this.populate("products.product")
    this.populate("user", ["first_name", "last_name", "email"])
})

cartsSchema.plugin(mongoosePaginate)

export default mongoose.model(cartsCollection, cartsSchema)

