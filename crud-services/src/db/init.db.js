import {Pool} from 'pg'
import config from '#@/configs/config.js'

class Database{
    constructor() {
        if (!Database.instance) {
            this.pool = new Pool(config.db);

            this.pool.on('error', (err) => {
                console.error('Unexpected error on idle client', err);
                process.exit(-1);
            });
            // Định nghĩa schema các bảng
            this.TABLE_SCHEMAS = [
                {
                    tableName: 'users',
                    query: `
                        CREATE TABLE users (
                            id SERIAL PRIMARY KEY,
                            email VARCHAR(255) NOT NULL UNIQUE,
                            password TEXT NOT NULL
                        );
                    `
                },
                {
                    tableName: 'task',
                    query: `
                        CREATE TABLE task (
                            id SERIAL PRIMARY KEY,
                            name VARCHAR(255) NOT NULL,
                            description TEXT,
                            deadline TIMESTAMPTZ,
                            working_time INTEGER,
                            finished BOOLEAN DEFAULT FALSE,
                            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
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
                            task_id INTEGER REFERENCES task(id) ON DELETE CASCADE,
                            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
                        );
                    `
                },
                {
                    tableName: 'setting',
                    query: `
                        CREATE TABLE setting (
                            user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                            dark_mode BOOLEAN DEFAULT TRUE,
                            activate BOOLEAN DEFAULT TRUE,
                            auto_schedule BOOLEAN DEFAULT TRUE,
                            notifications BOOLEAN DEFAULT TRUE
                        );
                    `
                },
                {
                    tableName: 'user_info',
                    query: `
                        CREATE TABLE user_info (
                            user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
                            name VARCHAR(255) DEFAULT '',
                            age INTEGER DEFAULT 0,
                            domain VARCHAR(255) DEFAULT '',
                            role VARCHAR(255) DEFAULT '',
                            level VARCHAR(255) DEFAULT '',
                            habits TEXT DEFAULT '',
                            busy_time TEXT DEFAULT '',
                            working_hours_per_day INTEGER DEFAULT 0,
                            peak_working_hours TEXT DEFAULT '',
                            more_info TEXT DEFAULT ''
                        );
                    `
                }
            ]
            Database.instance = this;
        }
        return Database.instance;
    }
    async query(text, param){
        return await this.pool.query(text, param)
    }

    async getClient() {
        return await this.pool.connect();
    }

    async init(){
        try {

            // const currentDb = await this.query("SELECT current_database();");
            // console.log("Code đang thực tế kết nối tới database:", currentDb.rows[0].current_database);
            console.log("Đang kiểm tra cơ sở dữ liệu...");

            for (const schema of this.TABLE_SCHEMAS) {
                const checkQuery = `
                    SELECT EXISTS (
                        SELECT FROM information_schema.tables 
                        WHERE table_schema = 'public' 
                        AND table_name = $1
                    );
                `;
                const res = await this.query(checkQuery, [schema.tableName]);
                const exists = res.rows[0].exists;
                
                if (!exists) {
                    console.log(`Đang tạo bảng '${schema.tableName}'...`);
                    await this.query(schema.query);
                    console.log(`Tạo bảng '${schema.tableName}' thành công.`);
                }
            }

            console.log("Cơ sở dữ liệu sẵn sàng!");
        } catch (error) {
            console.error("Lỗi khi tạo bảng:", error);
            process.exit(1);
        }
    }
}
const instance = new Database()
await instance.init()

export default instance