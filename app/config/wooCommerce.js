const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;
const querystring = require('querystring');
const User = require('../models/user');

exports.test = async (req, res) => {
    const WooCommerce = new WooCommerceRestApi({
        url: 'https://bamushop.com/',
        consumerKey: 'ck_753c6e532519c5643d8b69c0199f352c3fc5e423',
        consumerSecret: 'cs_ef3f485c8879a02661c639d9543cd240e730045a',
        version: 'wc/v3'
    });

    // List products
    WooCommerce.get("products", {
        per_page: 20, // 20 products per page
    })
        .then((response) => {
            // Successful request
            // console.log("Response Status:", response.status);
            // console.log("Response Headers:", response.headers);
            // console.log("Response Data:", response.data);
            // console.log("Total of pages:", response.headers['x-wp-totalpages']);
            // console.log("Total of items:", response.headers['x-wp-total']);
            res.status(200).send(response.data)
        })
        .catch((error) => {
            // Invalid request, for 4xx and 5xx statuses
            // console.log("Response Status:", error.response.status);
            // console.log("Response Headers:", error.response.headers);
            // console.log("Response Data:", error.response.data);
            res.status(400).json({ error })
        })
        .finally(() => {
            // Always executed.
        });
}

exports.permission = async (req, res) => {
    try {
        let { StoreName, storeUrl } = req.body;

        if (storeUrl) {
            await User.findByIdAndUpdate(req.user._id, { store: { name: StoreName, url: storeUrl } }, { new: true })

            const store_url = storeUrl;
            const endpoint = process.env.WOOCOMMERCE_AUTH_ENDPOINT;
            const params = {
                app_name: process.env.APP_NAME,
                scope: 'read_write',
                user_id: req.user._id,
                return_url: process.env.RETURN_URL,
                callback_url: process.env.WOOMETRICS_URL + '/v1/wooCommerce/callback-endpoint'
            };
            const query_string = querystring.stringify(params).replace(/%20/g, '+');
            const result = store_url + endpoint + '?' + query_string

            return res.redirect(result)
        }
    } catch (error) {
        res.status(400).json(error.message)
    }
}

exports.callbackEndpoint = async (req, res) => {
    await User.findByIdAndUpdate(req.body.user_id, { wooCommerceApiKeys: req.body })
    res.send("OK")
}