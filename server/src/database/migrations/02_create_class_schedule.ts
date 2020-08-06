import Knex from 'knex'


export async function up(knex: Knex){
 return knex.schema.createTable('class-schedule', table => {
     table.increments('id').primary();
     
     table.integer('week_day').notNullable(); // 0 domingo e 6 sábado
     table.integer('from').notNullable(); 
     table.integer('to').notNullable();
     
     //chave estrangeira
     table.integer('class_id')
        .notNullable()
        .references('id')
        .inTable('classes') //conograma relacionado com alguma aula.
        .onUpdate('CASCADE') 
        .onDelete('CASCADE') //deletar todas as aulas do professor
 });
}

export async function down(knex: Knex){
    return knex.schema.dropTable('class-schedule')
}