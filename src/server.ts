import { app } from './app.ts';

const PORT = 3050;

app.listen(PORT, (error) => {
    if (error)
        throw error;
    console.log(`Server is running at http://localhost:${PORT}`);
})