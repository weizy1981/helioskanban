// Sequelize  DB
var Sequelize = require('sequelize');
var sequelize = new Sequelize('syhyhqjb_kanban', 'syhyhqjb_kanban', 'testkanban', {
  host: '199.79.62.196',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  }
});
var User = sequelize.define('users', {
  user_id: {
    type: Sequelize.STRING,
    field: 'user_id' // Will result in an attribute that is firstName when user facing but first_name in the database
  },
  user_password: {
    type: Sequelize.STRING,
    field: 'user_password'
  }
}, {
  freezeTableName: true // Model tableName will be the same as the model name
});

exports.User = User;


