const express = require('express');
const PORT = 8000;
const app = express();
app.use(express.json());
const db = require("./models");
const cors = require('cors');
const { adminRouters, authRouters, attendanceRouters } = require('./routers');

app.get("/", (req, res) => {
    res.status(200).send("Hi")
});

app.use(cors());
app.use(express.static("./public"));
app.use("/admin", adminRouters);
app.use("/auth", authRouters);
app.use("/attendance", attendanceRouters);

app.listen(PORT, () => {
    // db.sequelize.sync({ alter: true });
    console.log("Hi");
})