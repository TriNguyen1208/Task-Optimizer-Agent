const db = require('./index'); 

const TABLE_SCHEMAS = [
  {
    tableName: 'tasks',
    query: `
      CREATE TABLE tasks (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        deadline TIMESTAMPTZ,
        working_time INTEGER,
        finished BOOLEAN DEFAULT FALSE
      );
    `
  }, 
  {
    tableName: 'schedule',
    query: `
      CREATE TABLE schedule (
        id SERIAL PRIMARY KEY,
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE
      );
    `
  } 
];

async function initDatabase() {
  try {
    console.log("Checking database...");

    for (const schema of TABLE_SCHEMAS) {
      const checkQuery = `
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        );
      `;
      
      const res = await db.query(checkQuery, [schema.tableName]);
      const exists = res.rows[0].exists;

      if (!exists) {
        console.log(`Creating table '${schema.tableName}'...`);
        await db.query(schema.query);
        console.log(`Successfully created table '${schema.tableName}'.`);
      }
    }
    console.log("Database ready!");

  } catch (error) {
    console.error("Error when creating tables:", error);
    process.exit(1); 
  }
}

module.exports = initDatabase;