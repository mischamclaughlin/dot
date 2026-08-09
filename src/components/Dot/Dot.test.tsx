import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import Dot from "./Dot";
// -----------------------------------------------------------------------------

function renderDot() {
    render(<Dot />);

    const canvas = screen.getByTestId("canvas");
    vi.spyOn(canvas, "getBoundingClientRect").mockReturnValue({
        x: 0,
        y: 0,
        top: 0,
        left: 0,
        right: 500,
        bottom: 500,
        width: 500,
        height: 500,
        toJSON: () => undefined,
    });

    return canvas;
}

function pointerDown(canvas: HTMLElement) {
    fireEvent.pointerDown(canvas, {
        clientX: 20,
        clientY: 20,
        pointerId: 1,
    });
}
function pointerMove(canvas: HTMLElement) {
    fireEvent.pointerMove(canvas, {
        clientX: 100,
        clientY: 80,
        pointerId: 1,
    });
}
function pointerUp(canvas: HTMLElement) {
    fireEvent.pointerUp(canvas, {
        clientX: 100,
        clientY: 80,
        pointerId: 1,
    });
}

describe("Dot component interactions", () => {
    describe("hover dot", () => {
        beforeEach(() => {
            const canvas = renderDot();
            pointerMove(canvas);
        });

        it("shows where the mouse is with a dot", () => {
            expect(screen.getByTestId("hover-dot")).toBeVisible();
        });

        it("snaps the hover dot to the grid", () => {
            expect(screen.getByTestId("hover-dot")).toHaveStyle({
                left: "97.5px",
                top: "82.5px",
            });
        });
    });

    describe("idle mode", () => {
        it("shows a temporary area while dragging", () => {
            const canvas = renderDot();

            pointerDown(canvas);
            pointerMove(canvas);

            expect(screen.getByTestId("temp-area")).toBeVisible();
        });

        it("shows the correct sidebar buttons for idle mode", () => {
            renderDot();

            expect(screen.getByRole("button", { name: "text" })).toBeVisible();
            expect(
                screen.queryByRole("button", { name: "back" }),
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("button", { name: "cancel" }),
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole("button", { name: "save" }),
            ).not.toBeInTheDocument();
        });

        it("does not create an area when the pointer does not move", () => {
            const canvas = renderDot();

            pointerDown(canvas);
            fireEvent.pointerUp(canvas, {
                clientX: 20,
                clientY: 20,
                pointerId: 1,
            });

            expect(screen.queryByTestId("select-area")).not.toBeInTheDocument();
        });

        it("removes the temporary area when Escape is pressed", async () => {
            const user = userEvent.setup();
            const canvas = renderDot();

            pointerDown(canvas);
            pointerMove(canvas);
            await user.keyboard("{Escape}");

            expect(screen.queryByTestId("temp-area")).not.toBeInTheDocument();
        });
    });

    describe("drawing mode", () => {
        it("shows the selected area when drawing completes", () => {
            const canvas = renderDot();

            pointerDown(canvas);
            pointerMove(canvas);
            pointerUp(canvas);

            expect(screen.getByTestId("select-area")).toBeVisible();
        });
    });

    describe("editing mode", () => {
        let user: ReturnType<typeof userEvent.setup>;

        beforeEach(async () => {
            user = userEvent.setup();

            const canvas = renderDot();

            pointerDown(canvas);
            pointerMove(canvas);
            pointerUp(canvas);

            await user.click(screen.getByRole("button", { name: "text" }));
        });

        it("shows an editable text area", () => {
            expect(screen.getByRole("textbox")).toBeVisible();
        });

        it("saves entered text as a canvas element", async () => {
            await user.type(screen.getByRole("textbox"), "Hello world");
            await user.click(screen.getByRole("button", { name: "save" }));

            expect(screen.getByText("Hello world")).toBeVisible();
            expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
        });

        it("discards the draft when cancel is clicked", async () => {
            await user.type(screen.getByRole("textbox"), "Discard me");
            await user.click(screen.getByRole("button", { name: "cancel" }));

            expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
            expect(screen.queryByTestId("select-area")).not.toBeInTheDocument();
            expect(screen.queryByText("Discard me")).not.toBeInTheDocument();
        });

        it("preserves the saved version when editing is cancelled", async () => {
            await user.type(screen.getByRole("textbox"), "Hello world");
            await user.click(screen.getByRole("button", { name: "save" }));
            await user.click(screen.getByRole("button", { name: "edit" }));
            await user.clear(screen.getByRole("textbox"));
            await user.type(
                screen.getByRole("textbox"),
                "Changes to be cancelled.",
            );
            await user.click(screen.getByRole("button", { name: "cancel" }));

            expect(screen.getByText("Hello world")).toBeVisible();
            expect(
                screen.queryByText("Changes to be cancelled."),
            ).not.toBeInTheDocument();
            expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
        });

        it("saves changes to an existing element", async () => {
            await user.type(screen.getByRole("textbox"), "Hello world");
            await user.click(screen.getByRole("button", { name: "save" }));
            await user.click(screen.getByRole("button", { name: "edit" }));
            await user.clear(screen.getByRole("textbox"));
            await user.type(screen.getByRole("textbox"), "Edited text.");
            await user.click(screen.getByRole("button", { name: "save" }));

            expect(screen.getByText("Edited text.")).toBeVisible();
            expect(screen.queryByText("Hello world")).not.toBeInTheDocument();
            expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
        });

        it("preserves the draft when returning through back", async () => {
            await user.type(screen.getByRole("textbox"), "Draft");
            await user.click(screen.getByRole("button", { name: "back" }));

            expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
            expect(screen.getByTestId("select-area")).toBeVisible();

            await user.click(screen.getByRole("button", { name: "text" }));

            expect(screen.getByRole("textbox")).toHaveValue("Draft");
        });

        it("cancels the current edit when Escape is pressed", async () => {
            await user.type(screen.getByRole("textbox"), "Hello world");
            await user.click(screen.getByRole("button", { name: "save" }));
            await user.click(screen.getByRole("button", { name: "edit" }));
            await user.clear(screen.getByRole("textbox"));
            await user.type(
                screen.getByRole("textbox"),
                "Changes to be cancelled.",
            );
            await user.keyboard("{Escape}");

            expect(screen.getByText("Hello world")).toBeVisible();
            expect(
                screen.queryByText("Changes to be cancelled."),
            ).not.toBeInTheDocument();
            expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
        });
    });

    describe("element selection", () => {
        it("selects an element and clears the transient selection", async () => {
            const user = userEvent.setup();
            const canvas = renderDot();

            pointerDown(canvas);
            pointerMove(canvas);
            pointerUp(canvas);
            await user.click(screen.getByRole("button", { name: "text" }));
            await user.type(screen.getByRole("textbox"), "Hello world");
            await user.click(screen.getByRole("button", { name: "save" }));

            const selectButton = screen.getByRole("button", {
                name: "Select Hello world",
            });
            await user.click(selectButton);

            expect(selectButton).toHaveAttribute("aria-pressed", "true");
            expect(screen.getByRole("button", { name: "clear" })).toBeVisible();

            await user.click(screen.getByRole("button", { name: "clear" }));

            expect(selectButton).toHaveAttribute("aria-pressed", "false");
            expect(
                screen.queryByRole("button", { name: "clear" }),
            ).not.toBeInTheDocument();
        });
    });
});
