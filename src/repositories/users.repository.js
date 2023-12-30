import userDTO from "../DAO/dtos/users.dto.js"


export default class userRepository {
    constructor(dao) {
        this.dao = dao
    }

    async getByEmail(email) {
        const result = await this.dao.findByEmail(email)
        return result
    }

    async create(user) {
        const DTOuser = new userDTO(user)
        console.log(DTOuser);
        const result = await this.dao.create(DTOuser)
        return result
    }
}