const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
});

// Fix: .default access karein agar direct function na mile
const plugin = passportLocalMongoose.default || passportLocalMongoose;
userSchema.plugin(plugin);

const User = mongoose.model("User", userSchema);

module.exports = User;