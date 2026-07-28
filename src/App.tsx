import type { ReactElement } from "react";

import SquareDot from "./components/Dot/Dot";

import "./App.css";
// -----------------------------------------------------------------------------

export default function App(): ReactElement {
    return (
        <div className="appContainer">
            <SquareDot />
        </div>
    );
}
