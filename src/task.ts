type Task = {
    id: string;
    text: string;
    scheduledAt: string;
    status: 'pending' | 'completed';
} 


const firstTask: Task = {
    id: 'task-1',
    text: 'Continue to learn TypeScript',
    scheduledAt: '2026-08-03T18:00:00+03:00',
    status: 'pending',
}

function completeTask(task: Task): Task {
    return {...task, status: 'completed'}
}

const completedTask = completeTask(firstTask);

console.log('original:', firstTask.status);
console.log('completed:', completedTask.status);

