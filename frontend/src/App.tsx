import {useEffect, useState} from "react";
import type {Task} from "./task.ts";
import * as React from "react";

function TaskList(props: { items: Task[]; onComplete: (id: string) => void }) {
    return (
        <ul>
            {props.items.map((task) => (
                    <li key={task.id}>
                        <p>
                            {task.text} <br/>
                            When: {new Date(task.scheduledAt).toLocaleString()} <br/>
                            Status: '{task.status}'
                        </p>
                        {task.status === 'pending' && <button onClick={() => {
                            props.onComplete(task.id)
                        }}>
                            Completed
                        </button>}
                    </li>
                )
            )}
        </ul>
    )
}

function App() {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [text, setText] = useState<string>('');
    const [scheduledAt, setScheduledAt] = useState<string>('');
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

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
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
            setText('');
            setScheduledAt('');

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

            if (!response.ok){
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
    if (isLoading) content =  <p>Loading...</p>
    else if (error) content = <p>Error: {error}</p>
    else if (tasks.length === 0) content = <p>No tasks yet. Create your first task</p>
    else content = <TaskList items={tasks} onComplete={completeTask}/>

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={text}
                    required={true}
                    onChange={(event) => setText(event.target.value)}
                />
                <input
                    type="datetime-local"
                    value={scheduledAt}
                    required={true}
                    onChange={(event) => setScheduledAt(event.target.value)}
                />
                <button type={"submit"}>Add task</button>
            </form>
            <div>
                {actionError && <p>{actionError}</p>}
                {content}
            </div>
        </>

    )
}

export default App
