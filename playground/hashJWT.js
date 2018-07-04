const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = '123abc!';

// bcrypt.genSalt(10, (err, salt) => {
//     bcrypt.hash(password, salt, (err, hash) => {
//         console.log(hash);
//     });
// });

var hashedPassword = '$2a$10$UFm/BYkOJd2Sd/IXIUf3IOBzrYXQkdTgcsrOGEccdMlNhslyxAngG';

bcrypt.compare(password, hashedPassword, (err, result) => {
    console.log(result);
})


// var data = {
//     id: 10
// };

// var token = jwt.sign(data, 'secretsalt');
// console.log(token);

// var decoded = jwt.verify(token, 'secretsalt');
// console.log('decoded: ', decoded);