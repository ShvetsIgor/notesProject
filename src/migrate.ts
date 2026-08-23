import {readFile} from "node:fs/promises";
import {createPool} from "./db.ts";

const schema = await readFile(new URL('./schema.sql', import.meta.url), "utf8");
const pool = createPool();
await pool.query(schema);
await pool.end();
console.log('Schema applied');



