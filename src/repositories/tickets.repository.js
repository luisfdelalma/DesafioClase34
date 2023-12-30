import ticketDTO from "../DAO/dtos/tickets.dto.js";

export default class ticketRepository {
    constructor(dao) {
        this.dao = dao
    }

    async create(code, purchase_datetime, amount, purchaser) {
        const DTOticket = new ticketDTO(code, purchase_datetime, amount, purchaser)
        const result = await this.dao.create(DTOticket)
        return result
    }

    async get(purchaser) {
        const result = await this.dao.get(purchaser)
        return result
    }
}