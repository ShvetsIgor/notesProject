import { createApp } from './app.ts';
import {createPool} from "./db.ts";

const PORT = 3050;

const pool = createPool();
const app = createApp(pool);

app.listen(PORT, (error) => {
    if (error)
        throw error;
    console.log(`Server is running at http://localhost:${PORT}`);
})
