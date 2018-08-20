var name = "world";

var result = `hello ${name}`;

console.log(result);

function lg(a) {
    console.log(a + result);
}

exports.lg = lg;