import productDTO from "../DAO/dtos/products.dto.js"

export default class productRepository {
    constructor(dao) {
        this.dao = dao
    }

    async create(title, BId, description, code, price, status, stock, category, thumbnail) {

        const DTOproduct = new productDTO(title, BId, description, code, price, status, stock, category, thumbnail)
        const result = await this.dao.create(DTOproduct)
        return result
    }

    async update(BId, product) {
        const result = await this.dao.update(BId, product)
        return result
    }

    async delete(BId) {
        const result = await this.dao.delete(BId)
        return result
    }

    async searchQuery(limit, page, sort, category, status) {
        const result = await this.dao.searchQuery(limit, page, sort, category, status)
        return result
    }

    async searchBId(BId) {
        const result = await this.dao.searchBId(BId)
        return result
    }

    async searchStock(id) {
        const result = await this.dao.searchStock(id)
        return result
    }

    async stockUpdate(id, update) {
        const result = await this.dao.stockUpdate(id, update)
        return result
    }
}