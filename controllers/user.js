const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.render('login', { errors: { email: { message: 'email not found' } } })
            return;
        }

        const match = await bcrypt.compare(req.body.password, user.password);
        if (match) {
            req.session.userID = user._id;
            console.log(req.session.userID);
            res.redirect('/');
            return
        }

        res.render('login', { errors: { password: { message: 'password does not match' } } })


    } catch (e) {
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
}

exports.list = async (req, res) => {
    try {
      const users = await User.find({});
      res.render("users", { users: users, message: req.query?.message});
    } catch (e) {
      res.status(404).send({ message: "could not list users" });
    }
  };

exports.create = async (req, res) => {
    try {

        const user = new User({ username: req.body.username, email: req.body.email, password: req.body.password });
        await user.save();
        res.redirect('/?message=user saved')
    } catch (e) {
        if (e.errors) {
            console.log(e.errors);
            res.render('register', { errors: e.errors })
            return;
        }
        return res.status(400).send({
            message: JSON.parse(e),
        });
    }
}