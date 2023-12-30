export default class ticketDTO {
    constructor(code, purchase_datetime, amount, purchaser) {
        this.code = code,
            this.purchase_datetime = purchase_datetime,
            this.amount = amount,
            this.purchaser = purchaser
    }
}