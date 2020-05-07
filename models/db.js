const Sequelize = require('sequelize');
const env = require('../env.js');

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
    host: env.DB_HOST,
    dialect: 'postgres',
    logging: false
});

class User {
    constructor() {
        this.model = sequelize.define('User', {
            email: {
                type: Sequelize.STRING,
                primaryKey: true,
                unique: true
            },
            password: Sequelize.STRING,
            refreshToken: Sequelize.STRING
        }, {
            freezeTableName: true
        })
    }
    async addUser(data) {
        try {
            await this.model.create(data);
        } catch (err) {
            console.log(err.message);
        }
        return true;
    }
    async addToken(data) {
        try {
            await this.model.bulkCreate(data, {
                updateOnDuplicate: ["refreshToken"]
            })
        } catch (err) {
            console.log(err.message)
        }
        return true;
    }
    async getUser(params) {
        return await this.model.findOne({
            where: {
                email: params
            },
            raw: true,
        })
    }
    sync() {
        return this.model.sync({
            force: true
        })
    }
}

exports.User = User;