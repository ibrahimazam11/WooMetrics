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
        let perPage = 10

        async.parallel([
            async () => {       //  successfull orders
                let response = await req.WooCommerce.get(`orders?per_page=${perPage}&status=completed`)
                response = wcReturn(response)
                if (response.pages > 1) {
                    for (let x = 2; x <= response.pages; x++) {
                        let newResponse = await req.WooCommerce.get(`orders?page=${x}&per_page=${perPage}&status=completed`)
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
                let response = await req.WooCommerce.get(`orders?per_page=${perPage}&status=failed`)
                response = wcReturn(response)
                if (response.pages > 1) {
                    for (let x = 2; x <= response.pages; x++) {
                        let newResponse = await req.WooCommerce.get(`orders?page=${x}&per_page=${perPage}&status=failed`)
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
            async function (cb) {   //customer orders
                let response = await req.WooCommerce.get(`orders?per_page=${perPage}`)
                response = wcReturn(response)
                if (response.pages > 1) {
                    for (let x = 2; x <= response.pages; x++) {
                        let newResponse = await req.WooCommerce.get(`orders?page=${x}&per_page=${perPage}`)
                        newResponse = wcReturn(newResponse)
                        response.data = response.data.concat(newResponse.data)
                    }
                }
                response.data = response.data.filter(resp => resp.customer_id != 0)
                response.items = response.data.length
                response.pages = Math.ceil(response.data.length / 100)
                let customer = {
                    name: 'Customer Orders',
                    orders: response.data.length,
                    grossSales: 0,
                    totalItems: 0,
                    AOV: 0,
                    AOI: 0
                }
                for (let resp of response.data) {
                    customer.grossSales = customer.grossSales + +resp.total
                    customer.totalItems = customer.totalItems + +resp.line_items.length
                }
                customer.grossSales = Math.round(((customer.grossSales) + Number.EPSILON) * 100) / 100
                customer.AOV = Math.round(((customer.grossSales / customer.orders) + Number.EPSILON) * 100) / 100;
                customer.AOI = Math.round(((customer.totalItems / customer.orders) + Number.EPSILON) * 100) / 100;
                return customer
            },
            async function (cb) {
                let response = await req.WooCommerce.get(`orders?per_page=${perPage}&customer=0`)
                response = wcReturn(response)
                if (response.pages > 1) {
                    for (let x = 2; x <= response.pages; x++) {
                        let newResponse = await req.WooCommerce.get(`orders?page=${x}&per_page=${perPage}&customer=0`)
                        newResponse = wcReturn(newResponse)
                        response.data = response.data.concat(newResponse.data)
                    }
                }
                let guest = {
                    name: 'Guest Orders',
                    orders: response.data.length,
                    grossSales: 0,
                    totalItems: 0,
                    AOV: 0,
                    AOI: 0
                }
                for (let resp of response.data) {
                    guest.grossSales = guest.grossSales + +resp.total
                    guest.totalItems = guest.totalItems + +resp.line_items.length
                }
                guest.grossSales = Math.round(((guest.grossSales) + Number.EPSILON) * 100) / 100
                guest.AOV = Math.round(((guest.grossSales / guest.orders) + Number.EPSILON) * 100) / 100;
                guest.AOI = Math.round(((guest.totalItems / guest.orders) + Number.EPSILON) * 100) / 100;
                return guest
            },
            // async function (cb) {    // EU orders

            // },
            async function (cb) {   // all orders
                let response = await req.WooCommerce.get(`orders?per_page=${perPage}`)
                response = wcReturn(response)
                if (response.pages > 1) {
                    for (let x = 2; x <= response.pages; x++) {
                        let newResponse = await req.WooCommerce.get(`orders?page=${x}&per_page=${perPage}`)
                        newResponse = wcReturn(newResponse)
                        response.data = response.data.concat(newResponse.data)
                    }
                }
                let all = {
                    name: 'All Orders',
                    orders: response.data.length,
                    grossSales: 0,
                    totalItems: 0,
                    AOV: 0,
                    AOI: 0
                }
                for (let resp of response.data) {
                    all.grossSales = all.grossSales + +resp.total
                    all.totalItems = all.totalItems + +resp.line_items.length
                }
                all.grossSales = Math.round(((all.grossSales) + Number.EPSILON) * 100) / 100
                all.AOV = Math.round(((all.grossSales / all.orders) + Number.EPSILON) * 100) / 100;
                all.AOI = Math.round(((all.totalItems / all.orders) + Number.EPSILON) * 100) / 100;
                return all
            }
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

exports.getCustomerOrders = async (req, res) => {
    try {
        let perPage = 10
        const query = QueryString.stringify(req.query).replace(/%20/g, '+');
        let response = await req.WooCommerce.get(`orders?per_page=${perPage}&${query}`)
        response = wcReturn(response)
        if (response.pages > 1) {
            for (let x = 2; x <= response.pages; x++) {
                let newResponse = await req.WooCommerce.get(`orders?page=${x}&per_page=${perPage}&${query}`)
                newResponse = wcReturn(newResponse)
                response.data = response.data.concat(newResponse.data)
            }
        }
        response.data = response.data.filter(resp => resp.customer_id != 0)
        response.items = response.data.length
        response.pages = Math.ceil(response.data.length / perPage)
        return res.send(response)
    } catch (error) {
        res.status(400).json(error.response.data)
    }
}