import Knex from 'knex'


export async function up(knex: Knex){
 return knex.schema.createTable('connections', table => {
     table.increments('id').primary();
     
     //chave estrangeira
     table.integer('user_id')
        .notNullable()
        .references('id')
        .inTable('users') //qual professor?
        .onUpdate('CASCADE') 
        .onDelete('CASCADE') //deletar todas as aulas do professor

     table.timestamp('created_at')
        .defaultTo(knex.raw('CURRENT_TIMESTAMP'))//pega o horario atual e salva 
        .notNullable()
    });
}

export async function down(knex: Knex){
    return knex.schema.dropTable('connections')
}