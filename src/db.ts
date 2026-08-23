import {Pool} from "pg";

export function createPool() {
    return new Pool({
        connectionString: process.env.DATABASE_URL
    })
}
