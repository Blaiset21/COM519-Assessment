const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new Schema(
    {
        username: { type: String, required: [true, 'need a username']},
        email: { type: String, required: [true, 'need an email'], unique: true },
        password: { type: String, required: [true, 'need a password'] }
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    console.log(this.password);
    try {
        const hash = await bcrypt.hash(this.password, 10);
        this.password = hash;
        next();
    } catch (e) {
        throw Error('could not hash password');
    }
})

module.exports = mongoose.model("User", userSchema);