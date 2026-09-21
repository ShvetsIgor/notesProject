import {useEffect, useState} from "react";
import type {Task} from "./task.ts";
import TaskList from "./components/TaskList.tsx";
import TaskForm from "./components/TaskForm.tsx";


function App() {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);

    useEffect(() => {
        const loadTasks = async () => {

            setIsLoading(true);
            setError(null);

            try {
                const response = await fetch('/api/tasks');
                if (!response.ok) {
                    throw new Error(`Request failed with status ${response.status}`)
                }
                const data = await response.json();
                setTasks(data);
            } catch (e) {
                setError("Failed to load the tasks. Please check the connection")
                console.error(e);
            } finally {
                setIsLoading(false);
            }
        }
        loadTasks();

    }, [])

    async function createTask(text: string, scheduledAt: string) {

        setActionError(null);

        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: text,
                    scheduledAt: new Date(scheduledAt).toISOString()
                })
            })
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`)
            }
            const created = await response.json();
            setTasks((prev) => [...prev, created]);

        } catch (e) {
            setActionError("Failed to add a task")
            console.error(e)
        }
    }

    async function completeTask(id: string) {
        setActionError(null);

        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({status: 'completed'})
            })

            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`)
            }

            const updated = await response.json();

            setTasks((prev) => prev.map((task) => task.id === updated.id ? updated : task));

        } catch (e) {
            setActionError("Failed to mark task as Completed")
            console.error(e)
        }
    }

    let content;
    if (isLoading) content = <p>Loading...</p>
    else if (error) content = <p>Error: {error}</p>
    else if (tasks.length === 0) content = <p>No tasks yet. Create your first task</p>
    else content = <TaskList items={tasks} onComplete={completeTask}/>

    return (
        <div className={"flex flex-col gap-6 max-w-3xl mx-auto p-6"}>
            <h1 className={"text-2xl font-bold text-center"}>My plans</h1>
            <TaskForm onCreate={createTask}/>
            <div>
                {actionError && <p className={"text-red-600"}>{actionError}</p>}
                {content}
            </div>
        </div>

    )
}

export default App
