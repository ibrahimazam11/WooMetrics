const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

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

exports.test1 = async (req, res) => {
    const querystring = require('querystring');

    const store_url = 'https://bamushop.com/';
    const endpoint = '/wc-auth/v1/authorize';
    const params = {
        app_name: 'WooMetrics',
        scope: 'read_write',
        user_id: 1234,
        return_url: 'https://woometrics-backend.herokuapp.com/api/v1/return-page',
        callback_url: 'https://woometrics-backend.herokuapp.com/api/v1/callback-endpoint'
    };
    const query_string = querystring.stringify(params).replace(/%20/g, '+');

    const result = store_url + endpoint + '?' + query_string
    console.log(result);
    res.send(result)
}
