const db = require('./knex');

db.schema.createTable('orders', (table) => {
  table.increments('id').primary();
  table.integer('user_id');
  table.json('cart');
  table.string('status');
  table.decimal('price');
  table.timestamp('created_at').defaultTo(db.fn.now());
})
.then(() => console.log("Tabela criada!"))
.catch((error) => console.error(error))
.finally(() => db.destroy());
