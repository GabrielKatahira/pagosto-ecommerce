const db = require('./knex');

db.schema.createTable('products', (table) => {
  table.increments('id').primary();
  table.string('name');
  table.string('description');
  table.string('category');
  table.json('prices');
  table.json('sizes');
  table.string('image');
})
.then(() => console.log("Tabela criada!"))
.catch((error) => console.error(error))
.finally(() => db.destroy());
