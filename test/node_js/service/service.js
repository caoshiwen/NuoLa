var test_do = require("./test_service");


exports.do = (query) => {
    console.log(query);
    test_do.do();
    return "the result";
}