
interface IButton {
    text: string,
    onClick: (value: any) => void,
    isDisabled?: boolean,
    widthType?: "medium" | "large" | "full",
    roundedFull?: boolean,
    style?: "primary" | "secondary",

}


export default function Button(props: IButton) {

    let use_width_full = "";

    switch (props.widthType) {
        case "medium":
            use_width_full = "w-[150px]";
            break;
        case "large":
            use_width_full = "w-[200px]";
            break;
        case "full":
            use_width_full = "w-full mx-0"
            break;
    }
    const use_rounded_full = (!!props.roundedFull) ? "rounded-full " : "rounded-md";
    const use_is_disabled = (!!props.isDisabled) ? "cursor-not-allowed opacity-50" : "cursor-pointer hover:border-black/50 transition-all hover:bg-neutral-500 hover:text-white";

    const custom_style = `${use_width_full} ${use_rounded_full} ${use_is_disabled}`;

    return (
        <button
            className={(custom_style + " m-1 bg-neutral-90 border border-neutral-300 h-max outline-neutral-200/80 outline-[4px]  px-4 py-1 outline   text-neutral-500  ease-out duration-100")}
            disabled={!!props.isDisabled}
            onClick={(e) => props.onClick(e)}>
            {props.text}
        </button>
    )
}