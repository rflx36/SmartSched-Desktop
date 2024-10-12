import { useState } from "react"


export interface IOptions {
    label: string,
    value: string
}

interface IDropdown {
    options: Array<IOptions>,
    value?: IOptions | undefined,
    label?: string,
    onChange: (value: IOptions | undefined) => void
}



export default function Dropdown(props: IDropdown) {
    const [isOpen, setIsOpen] = useState(false);

    const selectOption = (option: IOptions) => {
        props.onChange(option);
    }
    return (
        <div className="flex flex-col m-1 w-auto">
            {
                (props.label != null) &&
                (<label className="font-manrope-semibold text-sm mb-1" >{props.label}</label>)
            }
            <div
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setIsOpen(false)}
                tabIndex={0}
                className="
                 relative  bg-neutral-200/50 font-manrope-regular px-3 py-[4px] tabular-nums outline 
                 w-full min-h-[1.5em] h-9 rounded-md flex items-center outline-1 outline-neutral-300 
                 focus:outline-2 focus:outline-neutral-400 cursor-pointer"
            >
                <span className="flex-grow ">{(props.value != undefined)&&`(${props.value?.value})`} {props.value?.label}</span>
                <div className={(isOpen ? "border-b-neutral-400 translate-y-[-25%]" : "border-t-neutral-400 translate-y-[25%]") + " border-[6px] border-transparent translate-x-0 "}></div>
                <ul className={(isOpen ? "block" : " hidden") + "  w-full bg-neutral-100  max-h-[calc(50vh)] overflow-y-scroll shadow-sm z-50 absolute left-0 top-[calc(100%+0.25em)] m-0 p-0 list-none  border border-neutral-400/70 rounded-lg"}>
                    
                    {
                        props.options.map((x, i) => (
                            <li
                                onClick={e => {
                                    e.stopPropagation();
                                    selectOption(x);
                                    setIsOpen(false);
                                }}
                                className=" px-[0.5em] py-[0.5em] text-neutral-700 hover:text-black m-1 rounded-md hover:bg-neutral-200 cursor-pointer"
                                key={i}
                            >({x.value}) {x.label}</li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}