import React from "react"
import { useUIStore } from "../../stores/ui_store";








export default function ModalContainer(props: { children?: React.ReactNode, isActive: boolean }) {
    const ui_state = useUIStore();


    const close = () => {
        // let changed_state = ui_state.get;
        // changed_state.modal = "closed";
        // ui_state.set(changed_state);
        ui_state.get.modal = "closed";
        ui_state.set(ui_state.get);
    }

    if (props.isActive) {
        return (
            <div className="absolute grid place-content-center size-full top-0 left-0 z-10 ">
                <div className="bg-black absolute opacity-20 size-full"></div>
                <div className="relative size-max bg-neutral-100 outline outline-1 outline-neutral-600/10 rounded-lg z-20 px-4 py-2">
                    <button
                        onClick={close}
                        className="hover:bg-neutral-400/75 size-3 rounded-full p-2 absolute top-2 right-2 bg-neutral-300 grid place-content-center bg-[url('svgs/icon-close.svg')] bg-no-repeat bg-center bg-[length:10px_10px]" >
                    </button>
                    {props.children}
                </div>
            </div >
        )
    }
}