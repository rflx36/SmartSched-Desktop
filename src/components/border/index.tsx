import { ReactNode } from "react";


interface IBorder {
    children: ReactNode,
    flex?: boolean
}


export default function Border(props: IBorder) {
    return (
        <div className="flex flex-col p-1 w-max h-max border  shadow-inner border-baseline-border-outline bg-baseline-border-base rounded-lg ">
            {props.children}
        </div>
    )
}