export type Task =  {
    id: string;
    text: string;
    scheduledAt: string;
    status: 'pending' | 'completed'
}
