const QueryString = require('querystring');
const User = require('../models/user');

exports.permission = async (req, res) => {
    try {
        let { storeName, storeUrl } = req.body;

        if (storeUrl) {
            await User.findByIdAndUpdate(req.user._id, { store: { name: storeName, url: storeUrl } }, { new: true })

            const store_url = storeUrl;
            const endpoint = process.env.WOOCOMMERCE_AUTH_ENDPOINT;
            const params = {
                app_name: process.env.APP_NAME,
                scope: 'read_write',
                user_id: req.user._id.toString(),
                return_url: process.env.WOOMETRIC_PANEL_URL + '/project/dashboard',
                callback_url: process.env.WOOMETRICS_URL + '/v1/wc/callback-endpoint'
            };
            const query_string = QueryString.stringify(params).replace(/%20/g, '+');
            const result = store_url + endpoint + '?' + query_string

            return res.redirect(result)
        }
    } catch (error) {
        res.status(400).json(error.message)
    }
}

exports.callbackEndpoint = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.body.user_id, { wooCommerceApiKeys: req.body })
        res.send("OK")
    } catch (error) {
        res.status(400).json("Unable to save WC API Keys!")
    }
}