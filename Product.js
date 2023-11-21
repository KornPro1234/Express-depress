const { Model, DataTypes } = require('sequelize');
const sequelize = require('./database');

class Product extends Model {};

User.init({
  Name: {
    type: DataTypes.STRING
  },
  Description: {
    type: DataTypes.STRING
  },
  Product_id: {
    type: DataTypes.STRING
  }
}, {
  sequelize,
  modelName: 'Product',
  timestamps: false
})

module.exports = Product;