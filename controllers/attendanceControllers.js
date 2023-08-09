const db = require("../models");
const profile = db.Users;
const users = db.Attendance;
const roles = db.Role;
const { Op } = require("sequelize");
const attendance = require("../models/attendance");

module.exports = {
    clockIn: async (req, res) => {
        try {
            const userId = req.user.id;
            const currentTime = new Date()
            const timeOffSet = 7 * 60 * 60 * 1000
            const timeInIndonesia = new Date(currentTime.getTime() + timeOffSet)
            const check = await users.findOne({
                where: {
                    UserId: userId,
                    clockIn: {
                        [Op.and]: {
                            [Op.gte]: new Date(new Date().setHours(7, 0, 0, 0)),
                            [Op.lte]: new Date(new Date().setHours(30, 59, 59, 999))
                        }
                    }
                }
            });
            if (!check) {
                await users.create({
                    clockIn: timeInIndonesia,
                    UserId: userId
                });

                res.status(200).send({
                    message: 'You are Presented!'
                });
            } else throw { message: 'You have Clocked In' };
        } catch (error) {
            res.status(400).send(error);
        }
    },
    clockOut: async (req, res) => {
        try {
            const userId = req.user.id;
            const currentTime = new Date()
            const timeOffSet = 7 * 60 * 60 * 1000
            const timeInIndonesia = new Date(currentTime.getTime() + timeOffSet)
            const check = await users.findOne({
                where: {
                    UserId: userId,
                    clockOut: {
                        [Op.and]: {
                            [Op.gte]: new Date(new Date().setHours(7, 0, 0, 0)),
                            [Op.lte]: new Date(new Date().setHours(30, 59, 59, 999))
                        }
                    }
                }
            });
            if (!check) {
                await users.update({
                    clockOut: timeInIndonesia,
                },
                    {
                        where: { UserId: userId }
                    }
                );
                res.status(200).send({ message: 'Thank You for Today!' });
            } else throw { message: 'You have Clocked Out keluar' };
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    },
    employeeLog: async (req, res) => {
        try {
            const check = await users.findOne({
                where: {
                    id: req.user.id
                }
            });
            const start = new Date();
            start.setDate(start.getDate() + 1);
            start.setHours(-17, 0, 0, 0);

            const end = new Date();
            end.setDate(end.getDate() + 1);
            end.setHours(6, 59, 59, 599);

            const result = await users.findOne({
                where: {
                    UserId: req.user.id,
                    [Op.or]: [
                        {
                            clockOut: {
                                [Op.and]: {
                                    [Op.gte]: start,
                                    [Op.lte]: end,
                                }
                            }
                        },
                        {
                            clockIn: {
                                [Op.and]: {
                                    [Op.gte]: start,
                                    [Op.lte]: end,
                                }
                            }
                        }
                    ]
                }
            });
            res.status(200).send(result);
        } catch (error) {
            console.log(error);
            res.status(500).send(error);
        }
    },
    employeeAttendance: async (req, res) => {
        try {
            const userId = req.user.id
            const result = await users.findAll({
                atrributes: ["clockIn", "clockOut"],
                where: { userId },
            });
            res.status(200).send(result)
        } catch (error) {
            res.status(500).send(error)
        }
    },
    calculateSalary: async (req, res) => {
        try {
            const results = await users.findAll({
                where: { UserId: req.user.id },
                include: [
                    {
                        model: profile,
                        attributes: ["RoleId"],
                        include: [{ model: roles }],
                    },
                ],
            });

            const calculatedResults = results.map((result) => {
                let fee = 0;

                if (!result.clockIn && !result.clockOut) {
                    fee = 0;
                } else if (result.clockIn && !result.clockOut) {
                    fee = result.User.Role.salary * 0.5;
                } else if (result.clockIn && result.clockOut) {
                    fee = result.User.Role.fee;
                }
                return {
                    id: result.id,
                    date: result.date,
                    clockIn: result.clockIn,
                    clockOut: result.clockOut,
                    createdAt: result.createdAt,
                    updatedAt: result.updatedAt,
                    UserId: result.UserId,
                    User: {
                        PositionId: result.User.PositionId,
                        Position: {
                            id: result.User.Role.id,
                            position: result.User.Role.position,
                            fee: result.User.Role.fee,
                        },
                    },
                    fee: fee,
                };
            });

            res.status(200).send({
                results: calculatedResults,
                status: true,
            });
        } catch (error) {
            console.log(error);
            res.status(400).send(error);
        }
    },

}