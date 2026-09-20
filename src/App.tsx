import type { ReactElement } from "react";

import "./App.css";
import Dot from "./ui/Dot";

export default function App(): ReactElement {
    return (
        <div className="appContainer">
            <Dot />
        </div>
    );
}
