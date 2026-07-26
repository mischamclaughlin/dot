import type { ReactElement } from "react";
import { Fragment } from "react";

import type {
    PaddingDirection,
    PaddingGroup,
    PaddingItem,
} from "../../types/PaddingButtonTypes";

import styles from "../../PaddingButtons.module.css";
// -----------------------------------------------------------------------------

type StepButtonsProps = {
    items: PaddingItem[];
    joined?: boolean;
};

type AxisControlProps = {
    group: PaddingGroup;
    joined: boolean;
    onToggle?: () => void;
};

export function StepButtons({
    items,
    joined = false,
}: StepButtonsProps): ReactElement {
    const itemNames = items.map((item) => item.name).join(" and ");

    function updateItems(direction: PaddingDirection) {
        items.forEach((item) => item.onChange(direction));
    }

    return (
        <div
            className={`${styles.buttonRow} ${joined ? styles.joinedButtonRow : ""}`}
        >
            <button
                type="button"
                className={styles.buttonCentered}
                aria-label={`Decrease ${itemNames} padding`}
                onClick={() => updateItems("down")}
            >
                -
            </button>
            <button
                type="button"
                className={styles.buttonCentered}
                aria-label={`Increase ${itemNames} padding`}
                onClick={() => updateItems("up")}
            >
                +
            </button>
        </div>
    );
}

export default function AxisControl({
    group,
    joined,
    onToggle,
}: AxisControlProps): ReactElement {
    const hasJoinButton = onToggle !== undefined;

    return (
        <div
            className={`${styles.axisGrid} ${hasJoinButton ? "" : styles.allAxisGrid}`}
        >
            {group.items.map((item) => (
                <Fragment key={item.id}>
                    <div className={styles.valueRow}>
                        <p>{item.label}</p>
                        <p className={styles.paddingAmount}>{item.value}</p>
                    </div>
                    {!joined && <StepButtons items={[item]} />}
                </Fragment>
            ))}

            {joined && <StepButtons items={group.items} joined />}

            {hasJoinButton && (
                <button
                    type="button"
                    className={`
                        ${styles.buttonCentered}
                        ${styles.buttonSmall}
                        ${joined ? styles.active : ""}
                        ${styles.axisJoin}
                        `}
                    aria-label={`Join ${group.name} padding`}
                    aria-pressed={joined}
                    onClick={onToggle}
                >
                    {"]"}
                </button>
            )}
        </div>
    );
}
