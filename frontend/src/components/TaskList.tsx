import type {Task} from "../task.ts";

function TaskList(props: { items: Task[]; onComplete: (id: string) => void }) {
    return (
        <ul className={"grid grid-cols-1 md:grid-cols-2 gap-10"}>
            {props.items.map((task) => (
                    <li key={task.id}
                        className={`border rounded-3xl py-5 px-4 ${task.status === "completed" ? 'bg-gray-100 opacity-60' : 'bg-amber-100'}`}>
                        <h3>{task.text}</h3>
                        <time dateTime={task.scheduledAt}
                              className={'text-sm'}> {new Date(task.scheduledAt).toLocaleString()}</time>
                        <p> {task.status} </p>
                        {task.status === 'pending' &&
                            <button className={"border bg-sky-500 hover:bg-sky-700 text-white rounded-xl px-2 py-1"}
                                    onClick={() => {
                                        props.onComplete(task.id)
                                    }}
                            >
                                Completed
                            </button>}
                    </li>
                )
            )}
        </ul>
    )
}

export default TaskList;
