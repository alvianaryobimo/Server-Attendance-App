const db = require("../models");
const users = db.Users;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {
    register: async (req, res) => {
        try {
            const { fullName, email, phone, password, birthdate } = req.body;
            // const isEmailexist = await users.findOne({ where: { email: email } });
            // if (isEmailexist) throw { message: "Email has been used" }
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const result = await users.create({ fullName, email, phone, password: hashPassword, birthdate });
            res.status(200).send({
                status: 200,
                message: "Register success.",
                result
            });

        } catch (error) {
            console.log(error);
            res.status(400).send(error)
        }
    },
    adminLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const checkLogin = await users.findOne({
                where: { email: email }
            });

            if (!checkLogin) throw { message: "Email not Found." }
            if (checkLogin.isAdmin == false) throw { message: "You have to Login on Employee Login." }

            const isValid = await bcrypt.compare(password, checkLogin.password);

            if (!isValid) throw { message: "Username or Password Incorrect." };

            const payload = { id: checkLogin.id, isAdmin: checkLogin.isAdmin };
            const token = jwt.sign(payload, "minpro4", { expiresIn: "3h" });

            res.status(200).send({
                message: "Login success",
                user: checkLogin,
                token
            });
        } catch (error) {
            res.status(500).send({
                error,
                status: 500,
                message: 'Internal server error',
            });
        }
    },
    employeeLogin: async (req, res) => {
        try {
            const { email, password } = req.body;
            const checkLogin = await users.findOne({
                where: { email: email }
            });

            if (!checkLogin) throw { message: "User not Found." }
            if (!checkLogin.isAdmin == false) throw { message: "You have to Login on Admin Login." }

            const isValid = await bcrypt.compare(password, checkLogin.password);

            if (!isValid) throw { message: "Username or Password Incorrect." };

            const payload = { id: checkLogin.id, isAdmin: checkLogin.isAdmin };
            const token = jwt.sign(payload, "minpro4", { expiresIn: "3h" });

            res.status(200).send({
                message: "Login success",
                user: checkLogin,
                token
            });
        } catch (error) {
            console.log(error);
            res.status(500).send({
                error,
                status: 500,
                message: 'Internal server error',
            });
        }
    },
    keepLogin: async (req, res) => {
        try {
            const result = await users.findOne({ where: { id: req.user.id } });
            res.status(200).send(result);
        } catch (error) {
            res.status(400).send(error);
        }
    },
    updateProfile: async (req, res) => {
        try {
            const result = await users.update({
                imgProfile: req.file.filename,
            }, {
                where: { id: req.user.id }
            });
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send({
                error,
                status: 500,
                message: 'Internal server error.',
            });
        }
    },
}