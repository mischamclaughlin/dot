# Dot

Dot is a React, TypeScript and Vite prototype for arranging styled text blocks on a dot-grid canvas. This README describes the earlier `rework` implementation centred on DotGrid.

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

1. Drag on the dot grid to draw a text region, then choose **Text**, or choose **Text** before drawing.
2. Enter text and use the sidebar to choose typography presets, text/content alignment and foreground/background colours.
3. Choose **Save** to add the block to the current document, or **Back** / **Escape** to leave the draft.
4. Use a saved block's edge handles to resize it. The sidebar can be resized or hidden using its fullscreen controls; these controls hide the sidebar rather than entering browser fullscreen.

## Current limitations

Documents live in React state in memory. **Save** commits to the current document; refreshing the page loses the content. Persistent storage, file import/export and undo/redo are not implemented on this branch.

Text is the functional tool; the other selectors are placeholders. Existing text editing, moving saved blocks and multi-selection are not implemented.

## Architecture

| Location | Responsibility |
| --- | --- |
| `src/components/DotGrid/` | Reducer-backed canvas and sidebar. |
| `src/components/DotGrid/components/SidebarControls/` | Text styles, tool selection and draft actions. |
| `src/components/DotGrid/services/` | Grid snapping and coordinate conversion. |
| `src/components/DotGrid/state/` | Editor state and reducer. |
| `src/components/DotGrid/styles/` | Text presets and default styles. |
| `src/components/Notifications.tsx` | Save notifications. |

React components dispatch reducer actions; the canvas and sidebar render editor state. Grid services handle snapping and coordinate conversion. The document model holds saved elements separately from the current drawing or editing session.

## Development checks

| Command | Purpose |
| --- | --- |
| `npm run lint` | Run ESLint. |
| `npm run build` | Type-check with TypeScript and build with Vite. |

This branch does not have a configured automated test suite.

Run the relevant deterministic checks for behaviour changes. Canvas layout, dragging, resizing, focus and sidebar interactions also need browser verification; source inspection and unit tests do not establish that these interactions work correctly.
