exports.wcReturn = (response) => {
    let obj = {
        data: response.data
    };
    response.headers['x-wp-totalpages'] ? obj.pages = +response.headers['x-wp-totalpages'] : null;
    response.headers['x-wp-total'] ? obj.items = +response.headers['x-wp-total'] : null;
    return obj
}