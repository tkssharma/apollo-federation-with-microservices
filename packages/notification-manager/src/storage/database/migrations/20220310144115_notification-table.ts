import * as Knex from 'knex';

export async function up(knex: any): Promise<void> {
  return knex.schema.createTable('notifications', (tbl) => {
    tbl.uuid('uuid').primary();

    tbl.timestamp('created_at').notNullable().defaultTo(knex.raw('now()'));
    tbl.timestamp('modified_at').nullable();

    tbl.text('name').notNullable().defaultTo('');
    tbl.text('external_id').notNullable();
    tbl.text('type').notNullable().defaultTo('');

    tbl.text('recipient_name').notNullable().defaultTo('')
    tbl.text('recipient_email').notNullable().defaultTo('')

    tbl.text('status').defaultTo('pending');
    tbl.json('template_data').defaultTo(null);
    tbl.text('template_type').defaultTo(null);

  });
}

export async function down(knex: any): Promise<void> {
  return knex.schema.dropTable('notifications');
}
