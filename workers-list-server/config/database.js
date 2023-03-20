const Sequelize = require('sequelize');
const path = require('path');
module.exports = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname,'/../../database/workers.db'),
    logging: false,
    define: {
        timestamps: false,
    }
});
