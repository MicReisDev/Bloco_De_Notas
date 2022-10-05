//O sequelize foi separado para organizar melhor o código
const Sequelize = require("sequelize");

//conexão com o banco de dados db2
const sequelize = new Sequelize("db2","root","147852963",{
  
  host:"localhost",
  dialect:"mysql"

})

module.exports = { //este comando serve para expostarmos a instância do sequelize
  Sequelize: Sequelize,
  sequelize: sequelize
}