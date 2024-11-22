const db = require('./knex');

db.schema.createTable('users', (table) => {
  table.increments('id').primary();
  table.string('name');
  table.string('password');
  table.string('userType');
  table.json('cart');
})
.then(() => console.log("Tabela criada!"))
.catch((error) => console.error(error))
.finally(() => db.destroy());
