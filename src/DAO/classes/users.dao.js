import userModel from "../models/user.model.js"

export default class Users {

    findByEmail = async (email) => {
        try {
            const result = await userModel.findOne({ email: email })
            return result
        } catch (error) {
            console.log("Error: " + error);
            return null
        }
    }

    create = async (user) => {
        try {
            const userf = await userModel.findOne({ email: user.email })
            if (userf) {
                return null
            } else {
                const result = await userModel.create({ ...user })
                return result
            }
        } catch (error) {
            console.log("Error: " + error);
            return null
        }
    }


}