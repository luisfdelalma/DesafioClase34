import ticketModel from "../models/ticket.model.js";

export default class tickets {

    create = async (DTOticket) => {
        try {
            const result = await ticketModel.create({ code: DTOticket.code, purchase_datetime: DTOticket.purchase_datetime, amount: DTOticket.amount, purchaser: DTOticket.purchaser })
            return result
        } catch (error) {
            console.log("Error: " + error);
            return null
        }
    }

    get = async (purchaser) => {
        const ticket = await ticketModel.findOne({ purchaser: purchaser })
        return ticket
    }
}