var http = require("http"),
    url = require("url"),
    service = require("./service/service");

function start(route) {
    function onRequest(request, response) {
        //pathname
        //query
        let {
            pathname,
            query
        } = url.parse(request.url);
        console.log(`request for ${pathname} ${query} received.`);

        let re_route = route({
            request,
            response
        });
        if(re_route === 'service') {
            let result = service.do(query);
            //发送 HTTP 头部
            //HTTP 状态值: 200: ok
            // 内容类型: text/plain
            response.writeHead(200, {
                "Content-Type": "text/plain"
            });
            console.log(200);
            response.end(result);
        }

    }
    http.createServer(onRequest).listen(8888);
    console.log("server running at http:127.0.0.1:8888/");
}

exports.start = start;