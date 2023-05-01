const crypto = require('crypto');
const secret = 'konstantynopolitanczykowianeczka'
const encrypt = (password) => {
    const iv = Buffer.from(crypto.randomBytes(16));
    const cipher = crypto.createCipheriv('aes-256-ctr', Buffer.from(secret), iv);
    const encrypted_password = Buffer.concat([cipher.update(password), cipher.final()]);
    return { iv: iv.toString('hex'), encrypted_password: encrypted_password.toString('hex') };
};
const decrypt = (encryption) => {
    const decipher = crypto.createDecipheriv('aes-256-ctr', Buffer.from(secret), Buffer.from(encryption.iv, 'hex'));
    const decrypted_password = Buffer.concat([decipher.update(Buffer.from(encryption.encrypted_password, 'hex')), decipher.final()]);
    return decrypted_password.toString();
};
module.exports = { encrypt, decrypt };