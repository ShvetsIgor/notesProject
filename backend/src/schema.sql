CREATE TABLE IF NOT EXISTS tasks (
    id UUID PRIMARY KEY,
    text TEXT NOT NULL,
    scheduled_at TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed'))
);
