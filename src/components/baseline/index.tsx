import { ReactNode } from "react";


interface IBaseline {
    children: ReactNode,
    flex?: boolean,
    widthFull?: boolean,
}



export default function Baseline(props: IBaseline) {

    const use_flex = (!!props.flex) ? "flex" : "";
    const use_width_full = (!!props.widthFull) ? "w-[calc(100%-0.5rem)]":"w-max";
    const custom_style = `${use_flex} ${use_width_full}`;

    return (
        <div className={(custom_style + " p-1 items-end m-1 h-max border  drop-shadow-sm  border-neutral-300 rounded-md bg-neutral-100")}>
            {props.children}
        </div>
    )
}

