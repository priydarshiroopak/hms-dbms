const crypto = require('crypto');
const secret = 'konstantynopolitanczykowianeczka'
const decrypt = (encryption) => {
    const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(secret), Buffer.from(encryption.iv, 'hex'));
    const decrypted_password = Buffer.concat([decipher.update(Buffer.from(encryption.encrypted_password, 'hex')), decipher.final()]);
    return decrypted_password.toString();
};

let x = decrypt({encrypted_password: 'abc', iv: 'bdt'});
console.log(x);