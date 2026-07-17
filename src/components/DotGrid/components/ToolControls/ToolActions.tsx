import type { ReactElement } from "react";

import styles from "./ToolActions.module.css";

type ToolActionsProps = {
    onGoBack: (isBack: boolean) => void;
    onSaveItem: (isSave: boolean) => void;
};

export default function ToolActions({
    onGoBack,
    onSaveItem,
}: ToolActionsProps): ReactElement {
    return (
        <div className={styles.controlContainer}>
            <button className={styles.button} onClick={() => onGoBack(true)}>
                Back
            </button>
            <button className={styles.button} onClick={() => onSaveItem(true)}>
                Save
            </button>
        </div>
    );
}
