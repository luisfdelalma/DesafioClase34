import { productsServices } from "../repositories/index.js";

export const searchG = async (req, res) => {
    let limit = parseInt(req.query.limit)
    let page = parseInt(req.query.page)
    let sort = req.query.sort
    let category = req.query.category
    let status = req.query.status

    if (!limit || limit === 0) { limit = 10 }

    if (!page || page === 0) { page = 1 }

    if (sort == "ASC" || sort == "asc") { sort = 1 }
    if (sort == "DESC" || sort == "desc") { sort = -1 }
    if (!status) { status = [true, false] }
    if (!category) { category = ["Category A", "Category B", "Category C"] }

    let products = await productsServices.searchQuery(limit, page, sort, category, status)

    let rendProd = products.docs.map(item => item.toObject())
    // console.log(products);

    if (req.url.includes("?")) {
        if (req.url.includes("page")) {
            let nextUrl = `/api/products${req.url.replace(`page=${products.page}`, `${products.nextLink}`)}`
            let prevUrl = `/api/products${(req.url.replace(`page=${products.page}`, `${products.prevLink}`))}`

            res.render("products", { products: rendProd, hasNextPage: products.hasNextPage, hasPrevPage: products.hasPrevPage, prevLink: prevUrl, nextLink: nextUrl })

        } else {
            let nextUrl = `/api/products${req.url + `&${products.nextLink}`}`
            let prevUrl = `/api/products${(req.url.replace(`page=${products.page}`, `${products.prevLink}`))}`

            res.render("products", { products: rendProd, hasNextPage: products.hasNextPage, hasPrevPage: products.hasPrevPage, prevLink: prevUrl, nextLink: nextUrl })
        }

    } else {
        let nextUrl = `/api/products${req.url + `?${products.nextLink}`}`
        let prevUrl = `/api/products${(req.url.replace(`page=${products.page}`, `${products.prevLink}`))}`

        res.render("products", { products: rendProd, hasNextPage: products.hasNextPage, hasPrevPage: products.hasPrevPage, prevLink: prevUrl, nextLink: nextUrl })
    }



}

export const searchId = async (req, res) => {
    let id = parseInt(req.params.pid)
    let product = await productsServices.searchBId(id)

    // res.send({ result: "success", payload: product })
    res.render("singleproduct", { product: product })
}

export const create = async (req, res) => {
    let { title, BId, description, code, price, status, stock, category, thumbnail } = req.body

    let result = await productsServices.create(title, BId, description, code, price, status, stock, category, thumbnail)

    res.send({ status: "success", payload: result })
}

export const update = async (req, res) => {
    let BId = req.params.BId
    let productToModify = req.body

    let result = await productsServices.update(BId, productToModify)
    res.send({ result: "success", payload: result })
}

export const deleteP = async (req, res) => {
    let BId = req.params.BId

    let result = await productsServices.delete(BId)
    res.send({ result: "success", payload: result })

}