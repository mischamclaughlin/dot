import type { ReactElement } from "react";

import Dot from "./components/Dot/Dot";

import "./App.css";
// -----------------------------------------------------------------------------

export default function App(): ReactElement {
    return (
        <div className="appContainer">
            <Dot />
        </div>
    );
}
