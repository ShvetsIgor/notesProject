import { createApp } from './app.ts';
import {createPool} from "./db.ts";

const PORT = 3050;

const pool = createPool();
const app = createApp(pool);

try {
    await pool.query('SELECT 1'); 
} catch (error) {
    console.error("Failed to connect to the database: ", error)
    process.exit(1);
}


app.listen(PORT, (error) => {
    if (error)
        throw error;
    console.log(`Server is running at http://localhost:${PORT}`);
})
