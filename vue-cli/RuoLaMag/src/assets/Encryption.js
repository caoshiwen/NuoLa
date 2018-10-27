const PUB_KEY = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0Q23Kcow6AHGJtngIDRa
zB1q9k5+hoSeRW/BsCVuz6ARl9sIDe+4qys/x+sIEWQIWXwY/O9G9xJgpCHcx+2r
q3Xkl70beY5T9fCfhfE3rdm8q+YU6dAhrcev3wiJ8+aJ3R13fKGn315lFMUpuHNI
weTKIqN0uoCHaGZqYtdcJfBbZHfluPX5aMvyUSXhfpGpFqpniLDhAF4tWBDNeBTH
Hn49r7Koqv335xFsLnNDTzCu5I9SQleJa8tyQP2znj4m5j8aPbdyJWZk/B++Hnrx
qfYwwVFIJ4iN3K8dgHF0tWSMumKL0BsdHzeTKebyUVZAjdhrFbdLPgpg63/2doxp
5QIDAQAB
-----END PUBLIC KEY-----
`;
import crypto from 'crypto';

export default {
    encryptRsa: word => {
        // return crypto.publicEncrypt(PUB_KEY, Buffer.from(word, 'utf8'));
        return aesEncrypt(word);
    },
    decryptRsa: word => {
        // return crypto.publicDecrypt(PUB_KEY, Buffer.from(word,'utf8')).toString('utf8');
        return  aesDecrypt(word);
    },
    pwdEncrypt: word => {
        let hash = crypto.createHash('sha256');
        hash.update(word);
        return hash.digest('hex');
    },
    aesEncrypt,
    aesDecrypt,
    decryptKey,
}

function aesEncrypt(data) {
    if(!sessionStorage.rsa) {
        location.reload();
    }
    const key = decryptKey(JSON.parse(sessionStorage.rsa));
    const cipher = crypto.createCipher('aes192', key);
    var crypted = cipher.update(data, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

function aesDecrypt(encrypted) {
    if(!sessionStorage.rsa) {
        location.reload();
    }
    const key = decryptKey(JSON.parse(sessionStorage.rsa));
    const decipher = crypto.createDecipher('aes192', key);
    var decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
}

function decryptKey(key) {
    return crypto.publicDecrypt(PUB_KEY, Buffer.from(key,'utf8')).toString('utf8');
}



