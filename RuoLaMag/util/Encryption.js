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
module.exports = {
    encryptRsa: word => {
        // return crypto.privateEncrypt(prv_key, Buffer.from(word, 'utf8'));
        return aesEncrypt(word);
    },
    decryptRsa: word => {
        // return crypto.privateDecrypt(prv_key, Buffer.from(word,'utf8')).toString('utf8');
        return aesDecrypt(word);
    },
    pwdEncrypt: word => {
        try {

            let hash = crypto.createHash('sha256');
            hash.update(word);
            return hash.digest('hex');
        } catch (error) {
            console.warn(error);
            return "";
        }
    },
    aesEncrypt,
    aesDecrypt,
    encryptKey,
    SCRIPT
}

function aesEncrypt(data) {
    try {
        const cipher = crypto.createCipher('aes192', SCRIPT);
        var crypted = cipher.update(data, 'utf8', 'hex');
        crypted += cipher.final('hex');
        return crypted;
    } catch (error) {
        console.warn(error);
        return "";
    }

}

function aesDecrypt(encrypted) {
    try {
        const decipher = crypto.createDecipher('aes192', SCRIPT);
        var decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    } catch (error) {
        console.warn(error);
        return "";
    }
}

function encryptKey(key) {
    try {
        return crypto.privateEncrypt(prv_key, Buffer.from(key, 'utf8'));
    } catch (error) {
        console.warn(error);
        return "";
    }
}