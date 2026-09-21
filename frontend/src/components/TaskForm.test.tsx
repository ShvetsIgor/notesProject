import {expect, test, vi} from "vitest";
import userEvent from "@testing-library/user-event";
import {render, screen} from "@testing-library/react";
import TaskForm from "./TaskForm.tsx";

test('calls onCreate with entered values', async () => {

    const onCreate = vi.fn();
    const user = userEvent.setup();

    render(<TaskForm onCreate={onCreate}/>);

    await user.type(screen.getByLabelText('Task'), 'Call mom');
    await user.type(screen.getByLabelText('When'), '2026-09-25T18:30');
    await user.click(screen.getByRole('button', { name: 'Add task'}));

    expect(onCreate).toHaveBeenCalledWith('Call mom', '2026-09-25T18:30');

})
