const WooCommerceRestApi = require('@woocommerce/woocommerce-rest-api').default;

let wcPermission = async (req, res, next) => {
    if (req.user.wooCommerceApiKeys.consumer_key && req.user.wooCommerceApiKeys.consumer_secret) {
        const WooCommerce = new WooCommerceRestApi({
            url: 'https://kuruyemisler.com.tr/',    //req.user.store.url,
            consumerKey: 'ck_aa2d7267546aa17d0f49233628d687a2b1c9dc4a',     //req.user.wooCommerceApiKeys.consumer_key,
            consumerSecret: 'cs_a1218f1df630732f07c91d96ca286e01fceb96ec',     //req.user.wooCommerceApiKeys.consumer_secret,
            version: 'wc/v3'
        });
        req.WooCommerce = WooCommerce
        next()
    }
    else {
        return res.status(401).json("Please grant permission to your store")
    }
}

module.exports = { wcPermission }