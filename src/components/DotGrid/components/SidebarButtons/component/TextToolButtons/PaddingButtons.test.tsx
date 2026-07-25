import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { initialState } from "../../../../state/DotGridReducer";
import PaddingButtons from "./PaddingButtons";

describe("PaddingButtons", () => {
    it("updates one padding side independently", async () => {
        const user = userEvent.setup();
        const dispatch = vi.fn();

        render(<PaddingButtons state={initialState} dispatch={dispatch} />);

        await user.click(
            screen.getByRole("button", {
                name: "Decrease top padding",
            }),
        );

        expect(dispatch).toHaveBeenCalledWith({
            type: "item/paddingTop",
            payload: "down",
        });
    });

    it("updates both sides of a joined axis", async () => {
        const user = userEvent.setup();
        const dispatch = vi.fn();

        render(<PaddingButtons state={initialState} dispatch={dispatch} />);

        await user.click(
            screen.getByRole("button", {
                name: "Join top and bottom padding",
            }),
        );
        await user.click(
            screen.getByRole("button", {
                name: "Increase top and bottom padding",
            }),
        );

        expect(dispatch.mock.calls).toEqual([
            [{ type: "item/paddingTop", payload: "up" }],
            [{ type: "item/paddingBottom", payload: "up" }],
        ]);
    });

    it("updates every side when all padding is joined", async () => {
        const user = userEvent.setup();
        const dispatch = vi.fn();

        render(<PaddingButtons state={initialState} dispatch={dispatch} />);

        await user.click(
            screen.getByRole("button", {
                name: "Join padding on all sides",
            }),
        );
        await user.click(
            screen.getByRole("button", {
                name: "Decrease top and bottom and left and right padding",
            }),
        );

        expect(dispatch.mock.calls).toEqual([
            [{ type: "item/paddingTop", payload: "down" }],
            [{ type: "item/paddingBottom", payload: "down" }],
            [{ type: "item/paddingLeft", payload: "down" }],
            [{ type: "item/paddingRight", payload: "down" }],
        ]);
    });
});
