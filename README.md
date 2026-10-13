# Dot

Dot is a React, TypeScript and Vite text editor on a dot-grid canvas. The `full-rework` branch separates document state from drawing/editing sessions and supports saved-element controls and multi-selection.

## Getting started

Use Node.js 22.13+ on the Node 22 release line, or Node.js 24+, and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. To build and preview the production bundle:

```sh
npm run build
npm run preview
```

The build output is written to `dist/`. No backend or environment-variable configuration is required.

## Using the editor

1. Draw a region on the dot grid and choose the text tool, or choose the text tool before drawing.
2. Type into the text area and save the element, or cancel the draft.
3. Use saved-element controls to edit, copy, delete or select elements. Drag an element to move it and use its edge handles to resize it.
4. Select multiple elements to move, copy or delete them together; use the sidebar to clear the selection.
5. Hold Command while dragging with the left mouse button to pan the canvas. Resize or hide the sidebar using its controls; fullscreen hides the sidebar rather than entering browser fullscreen.

## Current limitations

Documents live in React state in memory. **Save** commits to the current document; refreshing the page loses the content. Persistent storage, file import/export and undo/redo are not implemented on this branch.

Text is the implemented element type. Parent relationships have initial document-model and reducer support, but there are no parent-setting or inheritance controls in this branch.

## Architecture

| Location | Responsibility |
| --- | --- |
| `src/components/Dot/components/Canvas/` | Drawing, editing, saved elements and drag controls. |
| `src/components/Dot/components/Sidebar/` | Tool, draft and selection actions. |
| `src/components/Dot/model/` | Versioned document and transient editor-state models. |
| `src/components/Dot/state/` | Initial state, reducer and reducer tests. |
| `src/components/Dot/services/` | Grid geometry and service tests. |
| `src/components/Dot/dotConfig/` | Canvas and sidebar configuration. |
| `src/test/` | Shared jsdom test setup. |

React components dispatch reducer actions; the canvas and sidebar render editor state. Grid services handle snapping and coordinate conversion. The document model holds saved elements separately from the current drawing or editing session.

## Development checks

| Command | Purpose |
| --- | --- |
| `npm test` | Run the Vitest suite once. |
| `npm run test:watch` | Run tests in watch mode. |
| `npm run lint` | Run ESLint. |
| `npm run build` | Type-check with TypeScript and build with Vite. |

Tests use Vitest with jsdom and shared setup in `src/test/setup.ts`. The `test:ui` script is also defined, but its optional `@vitest/ui` package is not included in the dependencies.

Run the relevant deterministic checks for behaviour changes. Canvas layout, dragging, resizing, focus and sidebar interactions also need browser verification; source inspection and unit tests do not establish that these interactions work correctly.
