import {expect, test, vi} from "vitest";
import userEvent from "@testing-library/user-event";
import {render, screen} from "@testing-library/react";
import TaskForm from "./TaskForm.tsx";

test('calls onCreate with entered values', async () => {

    const onCreate = vi.fn().mockResolvedValue(true);
    const user = userEvent.setup();

    render(<TaskForm onCreate={onCreate}/>);

    await user.type(screen.getByLabelText('Task'), 'Call mom');
    await user.type(screen.getByLabelText('When'), '2026-09-25T18:30');
    await user.click(screen.getByRole('button', { name: 'Add task'}));

    expect(onCreate).toHaveBeenCalledWith('Call mom', '2026-09-25T18:30');

})

test('saves entered values when onCreate returns false', async () => {

    const onCreate = vi.fn().mockResolvedValue(false);
    const user = userEvent.setup();

    render(<TaskForm onCreate={onCreate}/>);

    const textField = screen.getByLabelText('Task');
    const dateField = screen.getByLabelText('When');

    await user.type(textField, 'Call mom');
    await user.type(dateField, '2026-09-25T18:30');
    await user.click(screen.getByRole('button'));

    expect(textField).toHaveValue('Call mom');
    expect(dateField).toHaveValue('2026-09-25T18:30');

})
