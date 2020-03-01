const QueryString = require('querystring');
const { wcReturn } = require('../../lib/helpers')

exports.getAll = async (req, res) => {
    try {
        const query = QueryString.stringify(req.query).replace(/%20/g, '+');
        let response = await req.WooCommerce.get(`orders?${query}`)
        return res.json(wcReturn(response))
    } catch (error) {
        res.status(400).json(error.response.data)
    }
}

exports.refunds = async (req, res) => {
    try {
        const query = QueryString.stringify(req.query).replace(/%20/g, '+');
        let response = await req.WooCommerce.get(`orders/${req.params.orderId}/refunds?${query}`)
        return res.json(wcReturn(response))
    } catch (error) {
        res.status(400).json(error.response.data)
    }
}

exports.notes = async (req, res) => {
    try {
        const query = QueryString.stringify(req.query).replace(/%20/g, '+');
        let response = await req.WooCommerce.get(`orders/${req.params.orderId}/notes?${query}`)
        return res.json(wcReturn(response))
    } catch (error) {
        res.status(400).json(error.response.data)
    }
}

exports.addNote = async (req, res) => {
    try {
        let response = await req.WooCommerce.post(`orders/${req.params.orderId}/notes`, req.body)
        return res.json(wcReturn(response))
    } catch (error) {
        res.status(400).json(error.response.data)
    }
}