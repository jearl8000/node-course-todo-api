var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },
});

var User = mongoose.model('User', userSchema);

module.exports = {
    User: User
};
