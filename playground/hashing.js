const {SHA256} = require('crypto-js');

var message = 'I am User Number 3';

var hash = SHA256(message).toString();

console.log(`message: ${message}`);
console.log(`hash: ${hash}`);

// example of authenticating using hashes
// i.e. implementing JSON Web Token in plain JS
var data = {
    id: 4
};
var token = {
    data: data,
    hash: SHA256(JSON.stringify(data) + 'secretsalt').toString()
};

var resultHash = SHA256(JSON.stringify(token.data) + 'secretsalt').toString();

if (resultHash === token.hash){
    console.log('Data was not changed');
} else {
    console.log('Data was changed, dont trust.');
}