import {useState} from "react";
import * as React from "react";


function TaskForm (props: {onCreate: (text: string, scheduledAt: string) => Promise<boolean>}){

    const [text, setText] = useState<string>('');
    const [scheduledAt, setScheduledAt] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    async function handleSubmit (event: React.SubmitEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);

        try {
            const created = await props.onCreate(text, scheduledAt);

            if (created) {
                setText('');
                setScheduledAt('');
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className={"flex gap-2 items-center"}>
            <label> Task
                <input
                    className={"border rounded-xl px-2 py-1 w-full"}
                    type="text"
                    value={text}
                    required={true}
                    onChange={(event) => setText(event.target.value)}
                /></label>
            <label> When
                <input
                    className={"border rounded-xl px-2 py-1 w-full"}
                    type="datetime-local"
                    value={scheduledAt}
                    required={true}
                    onChange={(event) => setScheduledAt(event.target.value)}
                />
            </label>
            <button type={"submit"} disabled={isSubmitting} className="bg-sky-500 hover:bg-sky-700 text-white rounded-xl px-4 py-2 whitespace-nowrap">
                {isSubmitting ? 'Adding...' : 'Add task'}
            </button>
        </form>
    )
}

export default TaskForm;
