var url = require("url"),
    path = require("path"),
    fs = require("fs");
    // service = require("./service/service");

var root = path.resolve(process.argv[2] || ".");
const nuola = '\/NuoLa'
let route = ({
    request,
    response
}) => {
    console.log(`route ${root}`);
    let {
        pathname
    } = url.parse(request.url);
    if (pathname.match(/^\/service\//)) {
        return "service";
    } else {
        go(pathname, {
            request,
            response
        });
    }
}

exports.route = route;


var go = (pathname, {
    request,
    response
}) => {
    console.log(`go ${pathname}`);

    var filepath = path.join(root,  nuola + pathname);
    console.log(filepath);
    //获取文件
    fs.stat(filepath, (err, stats) => {
        if(!err && stats.isFile()){
            console.log("200" + request.url);
            response.writeHead(200);
            fs.createReadStream(filepath).pipe(response);
        } else {
            console.log("404" + request.url);
            response.writeHead(404);
            response.end("404 Not Found");
        }
    });
}