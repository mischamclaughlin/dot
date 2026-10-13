# Dot

Dot is a canvas-based text editor built with React, TypeScript and Vite. It is in development; this README describes the current `total-rework` implementation.

The editor lets you create and edit text elements, move and resize them, and undo or redo committed document changes. Its foundations separate the document model, application commands, editor state and React interface.

## Getting started

Use Node.js 22.12+ within the Node 22 release line, or Node.js 24+, and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite.

To build and preview the production bundle locally:

```sh
npm run build
npm run preview
```

## Using the editor

1. Choose **Add text** and type into the canvas text area.
2. Adjust the draft's position and dimensions using the sidebar controls, then choose **Save** to commit it or **Cancel** to discard it.
3. Click a saved element to toggle its selection. Choose **Edit** to edit the first selected element.
4. Drag a saved element to move it, or use its edge and corner handles to resize it. While editing an element, resizing changes its draft until you save.
5. Use **Undo** and **Redo** to navigate committed document changes. These actions are handled only when no draft is open.

Documents and history currently live in memory. **Save** commits a draft to the current document; refreshing the page clears the document. File import/export and persistent storage are not implemented. Copy, delete and text-style commands exist in the application layer but do not yet have UI controls.

## Architecture

| Location | Responsibility |
| --- | --- |
| `src/domain/` | Document and element types, geometry, runtime validation and immutable document operations. |
| `src/application/commands/` | Pure commands for creating, copying, deleting and updating elements, including committing text drafts. |
| `src/application/history/` | Document snapshots and undo/redo transitions. |
| `src/editor/stateMachine/` | Editor events and the reducer for idle, creating-text and editing-text modes. |
| `src/ui/` | React editor wiring, canvas rendering, pointer controls and sidebar. |
| `src/test/` | Shared test setup and valid element fixtures. |

`DotDocument` is a serialisable, versioned model with ordered `rootIds` and an element record keyed by ID. Text is currently the only element kind. Document operations return a new document or an explicit error result, and clone incoming elements to avoid sharing mutable input data.

The editor keeps an active draft separate from the committed document. Saving validates and commits the draft as a history entry; cancelling discards it. Moving or resizing a saved element commits its new rectangle through an application command. React renders the reducer state and dispatches events, while the domain and application layers remain independent of React.

## Development checks

| Command | Purpose |
| --- | --- |
| `npm test` | Run the Vitest suite once. |
| `npm run test:watch` | Run tests in watch mode. |
| `npm run test:ui` | Open the Vitest test interface. |
| `npm run test:coverage` | Run tests with V8 coverage and enforce the configured thresholds. |
| `npm run lint` | Run ESLint. |
| `npm run build` | Type-check with TypeScript and build with Vite. |

Tests use jsdom, with shared setup in `src/test/setup.ts`. Tests sit alongside the domain, application and editor state modules they cover. Coverage thresholds are configured in `vite.config.ts`, including 100% coverage requirements for the domain and application layers.

For changes to the document or editor behaviour, run the relevant tests, lint and build. Canvas layout, pointer dragging, resizing and browser focus also need browser verification; passing unit tests alone does not establish that those interactions work correctly.
