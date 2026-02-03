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
                },
                
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