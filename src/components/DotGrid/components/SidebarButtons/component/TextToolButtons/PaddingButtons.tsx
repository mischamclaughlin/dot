import { Fragment, useState } from "react";
import type { ReactElement, ReactNode } from "react";

import type { DotGridProps } from "../../../../types/DotGridProps";

import styles from "./PaddingButtons.module.css";
// -----------------------------------------------------------------------------

type PaddingDirection = "down" | "up";
type PaddingAxis = "height" | "width";

type PaddingItem = {
    id: "top" | "bottom" | "left" | "right";
    label: "T" | "B" | "L" | "R";
    name: string;
    value: ReactNode;
    onChange: (direction: PaddingDirection) => void;
};

type PaddingGroup = {
    name: string;
    items: PaddingItem[];
};

type PaddingAxisGroup = PaddingGroup & {
    id: PaddingAxis;
};

type StepButtonsProps = {
    items: PaddingItem[];
    joined?: boolean;
};

function StepButtons({
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

type AxisControlProps = {
    group: PaddingGroup;
    joined: boolean;
    onToggle?: () => void;
};

function AxisControl({
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
                    className={`${styles.buttonCentered} ${styles.buttonSmall} ${joined ? styles.active : ""} ${styles.axisJoin}`}
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

export default function PaddingButtons({
    state,
    dispatch,
}: DotGridProps): ReactElement {
    const [joinedAxes, setJoinedAxes] = useState<Record<PaddingAxis, boolean>>({
        height: false,
        width: false,
    });
    const [allJoined, setAllJoined] = useState<boolean>(false);

    const groups: PaddingAxisGroup[] = [
        {
            id: "height",
            name: "top and bottom",
            items: [
                {
                    id: "top",
                    label: "T",
                    name: "top",
                    value: state.itemStyle.paddingTop,
                    onChange: (payload) =>
                        dispatch({ type: "item/paddingTop", payload }),
                },
                {
                    id: "bottom",
                    label: "B",
                    name: "bottom",
                    value: state.itemStyle.paddingBottom,
                    onChange: (payload) =>
                        dispatch({ type: "item/paddingBottom", payload }),
                },
            ],
        },
        {
            id: "width",
            name: "left and right",
            items: [
                {
                    id: "left",
                    label: "L",
                    name: "left",
                    value: state.itemStyle.paddingLeft,
                    onChange: (payload) =>
                        dispatch({ type: "item/paddingLeft", payload }),
                },
                {
                    id: "right",
                    label: "R",
                    name: "right",
                    value: state.itemStyle.paddingRight,
                    onChange: (payload) =>
                        dispatch({ type: "item/paddingRight", payload }),
                },
            ],
        },
    ];

    function toggleAxis(axis: PaddingAxis) {
        setJoinedAxes((current) => ({
            ...current,
            [axis]: !current[axis],
        }));
    }

    const allPadding: PaddingGroup = {
        name: "all sides",
        items: groups.flatMap((group) => group.items),
    };

    return (
        <div className={styles.paddingGrid}>
            <div className={styles.axes}>
                {allJoined ? (
                    <AxisControl group={allPadding} joined />
                ) : (
                    groups.map((group) => (
                        <AxisControl
                            key={group.id}
                            group={group}
                            joined={joinedAxes[group.id]}
                            onToggle={() => toggleAxis(group.id)}
                        />
                    ))
                )}
            </div>

            <button
                type="button"
                className={`${styles.buttonCentered} ${styles.buttonSmall} ${styles.allJoin} ${allJoined ? styles.active : ""}`}
                aria-label="Join padding on all sides"
                aria-pressed={allJoined}
                onClick={() => setAllJoined((current) => !current)}
            >
                {"]"}
            </button>
        </div>
    );
}
