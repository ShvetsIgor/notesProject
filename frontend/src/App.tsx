import {useEffect, useState} from "react";
import type {Task} from "./task.ts";
import * as React from "react";

function TaskList(props: { items: Task[]; onComplete: (id: string) => void }) {
    return (
        <ul className={"grid grid-cols-1 md:grid-cols-2 gap-10"}>
            {props.items.map((task) => (
                    <li key={task.id} className={`border rounded-3xl py-5 px-4 ${task.status === "completed" ? 'bg-gray-100 opacity-60' : 'bg-amber-100'}`}>
                        <p>
                            {task.text} <br/>
                            When: {new Date(task.scheduledAt).toLocaleString()} <br/>
                            Status: '{task.status}'
                        </p>
                        {task.status === 'pending' && <button className={"border bg-sky-500 hover:bg-sky-700 text-white rounded-xl px-2 py-1"}
                            onClick={() => { props.onComplete(task.id) }}
                        >
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
        <div className={"flex flex-col gap-6 max-w-3xl mx-auto p-6"}>
            <h1 className={"text-2xl font-bold text-center"}>My plans</h1>
            <form onSubmit={handleSubmit} className={"flex gap-2 items-center"}>
                <input
                    className={"border rounded-xl px-2 py-1 w-full"}
                    type="text"
                    value={text}
                    required={true}
                    onChange={(event) => setText(event.target.value)}
                />
                <input
                    className={"border rounded-xl px-2 py-1"}
                    type="datetime-local"
                    value={scheduledAt}
                    required={true}
                    onChange={(event) => setScheduledAt(event.target.value)}
                />
                <button type={"submit"} className="bg-sky-500 hover:bg-sky-700 text-white rounded-xl px-4 py-1 whitespace-nowrap">Add task</button>
            </form>
            <div>
                {actionError && <p className={"text-red-600"}>{actionError}</p>}
                {content}
            </div>
        </div>

    )
}

export default App
