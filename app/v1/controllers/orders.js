const QueryString = require('querystring');
const async = require('async');
const { wcReturn } = require('../../lib/helpers')
const constants = require('../../lib/constants');

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

exports.segments = async (req, res) => {
    try {


        async.parallel([
            async () => {       //  successfull orders
                let response = await req.WooCommerce.get(`orders?per_page=100&status=completed`)
                response = wcReturn(response)
                if (response.pages > 1) {
                    for (let x = 2; x <= response.pages; x++) {
                        let newResponse = await req.WooCommerce.get(`orders?page=${x}&per_page=100&status=completed`)
                        newResponse = wcReturn(newResponse)
                        response.data = response.data.concat(newResponse.data)
                    }
                }
                let successfull = {
                    name: 'Successfull Orders',
                    orders: response.data.length,
                    grossSales: 0,
                    totalItems: 0,
                    AOV: 0,
                    AOI: 0
                }
                for (let resp of response.data) {
                    successfull.grossSales = successfull.grossSales + +resp.total
                    successfull.totalItems = successfull.totalItems + +resp.line_items.length
                }
                successfull.grossSales = Math.round(((successfull.grossSales) + Number.EPSILON) * 100) / 100
                successfull.AOV = Math.round(((successfull.grossSales / successfull.orders) + Number.EPSILON) * 100) / 100;
                successfull.AOI = Math.round(((successfull.totalItems / successfull.orders) + Number.EPSILON) * 100) / 100;
                return successfull
            },
            async () => {   //  failed orders
                let response = await req.WooCommerce.get(`orders?per_page=100&status=failed`)
                response = wcReturn(response)
                if (response.pages > 1) {
                    for (let x = 2; x <= response.pages; x++) {
                        let newResponse = await req.WooCommerce.get(`orders?page=${x}&per_page=100&status=failed`)
                        newResponse = wcReturn(newResponse)
                        response.data = response.data.concat(newResponse.data)
                    }
                }
                let failed = {
                    name: 'Failed Orders',
                    orders: response.data.length,
                    grossSales: 0,
                    totalItems: 0,
                    AOV: 0,
                    AOI: 0
                }
                for (let resp of response.data) {
                    failed.grossSales = failed.grossSales + +resp.total
                    failed.totalItems = failed.totalItems + +resp.line_items.length
                }
                failed.grossSales = Math.round(((failed.grossSales) + Number.EPSILON) * 100) / 100
                failed.AOV = Math.round(((failed.grossSales / failed.orders) + Number.EPSILON) * 100) / 100;
                failed.AOI = Math.round(((failed.totalItems / failed.orders) + Number.EPSILON) * 100) / 100;
                return failed
            },
            // async function (cb) {

            // },
            // async function (cb) {

            // },
            // async function (cb) {

            // },
            // async function (cb) {

            // }
        ],
            (err, result) => {
                if (err) throw err
                return res.send(result)
            })
    } catch (error) {
        console.error(error)
        res.status(400).json(error.response.data)
    }
}