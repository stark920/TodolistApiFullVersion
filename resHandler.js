const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET, OPTIONS, DELETE',
    'Content-Type': 'application/json'
}
const statusMsg = {
    '400': '',
    '401': '',
    '404': '',
    '405': '',
}
const sendRes = (res, data) => {
    res.writeHead(200, headers);
    if (data) {
        res.write(JSON.stringify({
            'status': 'true',
            'data': data
        }))
    }
    res.end();
}
const sendErr = (res, statusCode) => {
    res.writeHead(statusCode, headers);
    res.write(JSON.stringify({
        'status': 'false',
        'msg': statusMsg[statusCode]
    }))
    res.end();
}

module.exports = {
    sendRes,
    sendErr
}