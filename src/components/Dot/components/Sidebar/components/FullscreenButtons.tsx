import type { Dispatch, ReactElement, SetStateAction } from "react";

import { dotConfig } from "../../../dotConfig/DotConfig";

import stylesBtn from "../styles/Button.module.css";
// -----------------------------------------------------------------------------

type FullscreenButtonProps = {
    width: number;
    onSetIsFullscreen: Dispatch<SetStateAction<boolean>>;
};

export default function FullscreenButton({
    width,
    onSetIsFullscreen,
}: FullscreenButtonProps): ReactElement {
    return (
        <button
            className={`${stylesBtn.btn} ${stylesBtn.fullscreenBtn}`}
            style={{
                minWidth: `${dotConfig.minWidth - 25}px`,
                width: `${width - 25}px`,
            }}
            onClick={() => onSetIsFullscreen((f) => !f)}
        >
            Fullscreen
        </button>
    );
}
