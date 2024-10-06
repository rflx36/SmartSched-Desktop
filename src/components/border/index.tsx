import { ReactNode } from "react";


interface IBorder {
    children: ReactNode,
    flex?: boolean
}


export default function Border(props: IBorder) {
    return (
        <div className="flex flex-col p-1 w-max h-max border  shadow-inner border-white bg-neutral-200/80 rounded-lg ">
            {props.children}
        </div>
    )
}