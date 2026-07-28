import { useRef, type ReactElement } from "react";

import styles from "./Sidebar.module.css";
// -----------------------------------------------------------------------------

export default function Sidebar(): ReactElement {
    const sideBarRef = useRef(null);

    return (
        <>
            <div className={styles.container} ref={sideBarRef}>
                <div className={styles.sidebarContainer}>
                    <h1 className={styles.header}>Dot.</h1>
                    <h2 className={styles.headerTool}>TOOL</h2>
                    <div className={styles.optionContainer}>
                        <button className={styles.btn}>text</button>
                        <button className={styles.btn}>coming soon.</button>
                        <button className={styles.btn}>coming soon.</button>
                        <button className={styles.btn}>coming soon.</button>
                    </div>
                </div>
                <div className={styles.dragBox}>
                    <div className={styles.dragBar} />
                </div>
            </div>
            <button className={`${styles.btn} ${styles.fullscreenBtn}`}>
                Fullscreen
            </button>
        </>
    );
}
