const db = require("../models");
const users = db.Users;
const roles = db.Role;
const jwt = require('jsonwebtoken');
const fs = require("fs")
const handlebars = require("handlebars")
const transporter = require("../middleware/transporter.js")

module.exports = {
    getAllEmployees: async (req, res) => {
        try {
            const result = await users.findAll({
                include: [{
                    model: roles,
                    attributes: ["position", "salary"]
                }]
            });
            res.status(200).send(result);

        } catch (error) {
            console.log(error);
            res.status(400).send({
                status: 400,
                message: "Internal server error."
            });
        };
    },
    sendEmail: async (req, res) => {
        try {
            const { email, RoleId } = req.body;
            const findUser = await users.findOne({ where: { email: email } });
            if (!findUser) throw { message: "E-mail not found." }
            const data = await fs.readFileSync("./send_email_template.html", "utf-8");
            const tempCompile = await handlebars.compile(data);
            const tempResult = tempCompile(data);
            const payload = { id: findUser.id }
            const token = jwt.sign(payload, "minpro4", { expiresIn: "4h" });
            const htmlWithToken = tempResult.replace('TOKEN_PLACEHOLDER', token);
            await transporter.sendMail({
                from: "aryobimoalvian@gmail.com",
                to: email,
                subject: "Register Your Account.",
                html: htmlWithToken
            });
            res.status(200).send(token);
        } catch (error) {
            console.log(error);
            res.status(500).send({
                error,
                status: 500,
                message: 'Internal server error.',
            });
        };
    },
    employeesRole: async (req, res) => {
        try {
            const result = await roles.findAll();
            res.status(200).send(result)
        } catch (error) {
            console.log(error);
            res.status(500).send(error)
        }
    }
}