import type { ReactElement } from "react";
import { useState } from "react";

import type { DotGridProps } from "../../../../types/DotGridProps";
import type {
    PaddingAxis,
    PaddingAxisGroup,
    PaddingGroup,
} from "./types/PaddingButtonTypes";

import AxisControl from "./components/PaddingButton/AxisControl";

import styles from "./PaddingButtons.module.css";
// -----------------------------------------------------------------------------

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
