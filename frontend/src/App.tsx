import {useEffect, useState} from "react";
import type {Task} from "./task.ts";
import * as React from "react";

function TaskList(props: { items: Task[]; onComplete: (id: string) => void }) {
    return (
        <ul>
            {props.items.map((task) => (
                    <li  key={task.id}>
                        <p>
                            {task.text} <br/>
                            When: {new Date(task.scheduledAt).toLocaleString()} <br/>
                            Status: '{task.status}'
                        </p>
                        {task.status === 'pending' && <button onClick = { () => { props.onComplete(task.id) } }>
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

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const response = await fetch('/api/tasks');
                if (!response.ok) {
                    return
                }
                const data = await response.json();
                setTasks(data);
            } catch (e) {
                console.error(e);
            }
        }
        loadTasks();
    }, [])

    async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
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
                return
            }
            const created = await response.json();
            setTasks((prev) => [ ...prev, created]);
            setText('');
            setScheduledAt('');

        } catch (e) {
            console.error(e)
        }
    }

    async function completeTask (id: string) {
        const response = await fetch(`/api/tasks/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: 'completed'})
        })

        const updated = await response.json();

        setTasks((prev) => prev.map((task) => task.id === updated.id ? updated : task));
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                />
                <input
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(event) => setScheduledAt(event.target.value)}
                />
                <button type={"submit"}>Add task</button>
            </form>
            <div>
                <TaskList items={tasks} onComplete={completeTask}/>
            </div>
        </>

    )
}

export default App
