const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const validator = require('validator');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        minlength: 5,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        },
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// instance methods

// override existing toJSON method to avoid sending unsafe data
userSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
}

// generate auth tokens
userSchema.methods.generateAuthToken = function(){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({
        _id: user._id.toHexString(),
        access: access
    }, 'secretsalt').toString();
    user.tokens = user.tokens.concat([{access: access, token: token}]);
    // user.tokens.push({access: access, token: token});

    return user.save().then(() => {
        console.log("token generated: ", token)
        return token;
    });
};

// model (static) methods
userSchema.statics.findByToken = function(token) {
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'secretsalt');
    } catch(e) {
        console.log("error in findByToken: ", e);
        // return new Promise((resolve, reject) => {
        //     reject();
        // }); -- below is a shorter way of saying the same thing:
        return Promise.reject();
    }
    // findOne returns a promise, so we return it, so that we can chain then() calls
    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,   // the quotes are needed because we're looking up subobjects
        'tokens.access': 'auth'  // (basically we're quoting it to handle the dots)
    });
};

var User = mongoose.model('User', userSchema);

module.exports = {
    User: User
};
