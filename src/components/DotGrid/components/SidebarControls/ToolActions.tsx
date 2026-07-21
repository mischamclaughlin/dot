import type { ReactElement } from "react";

import styles from "./ToolActions.module.css";

type ToolActionsProps = {
    isSaveable: boolean;
    onGoBack: (isBack: boolean) => void;
    onSaveItem: (isSave: boolean) => void;
};

export default function ToolActions({
    isSaveable,
    onGoBack,
    onSaveItem,
}: ToolActionsProps): ReactElement {
    return (
        <div className={styles.controlContainer}>
            <button className={styles.button} onClick={() => onGoBack(true)}>
                Back
            </button>
            {isSaveable ? (
                <button
                    className={styles.button}
                    onClick={() => onSaveItem(true)}
                >
                    Save
                </button>
            ) : (
                <button
                    className={styles.button}
                    disabled
                    onClick={() => onSaveItem(true)}
                >
                    Save
                </button>
            )}
        </div>
    );
}
