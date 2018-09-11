const
    fs = require('fs'),
    crypto = require('crypto');

function loadKey(file) {
    return fs.readFileSync(file, 'utf8');
}

let 
    prv_key = loadKey(__dirname + '/rsa-prv.pem'),
    pub_key = loadKey(__dirname + '/rsa-pub.pem');
const SCRIPT = 'ruolascript'
module.exports =  {
    encryptRsa: word => {
        return crypto.privateEncrypt(prv_key, Buffer.from(word, 'utf8'));
    },
    decryptRsa: word => {
        return crypto.privateDecrypt(prv_key, Buffer.from(word,'utf8')).toString('utf8');
    },
    pwdEncrypt: word => {
        let hash = crypto.createHash('sha256');
        hash.update(word);
        return hash.digest('hex');
    },
}

