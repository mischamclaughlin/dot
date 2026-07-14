import DotGrid from "./components/DotGrid";
import "./App.css";
import DotGridSideBar from "./components/DotGridSideBar";

export default function App() {
    return (
        <>
            <div className="appContainer">
                <DotGridSideBar />
                <DotGrid />
            </div>
        </>
    );
}
