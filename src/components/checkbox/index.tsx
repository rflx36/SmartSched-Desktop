
interface ICheckbox {
    name: string,
    default: boolean,
    onChange: (e: boolean) => void,
    textStyle?: "base" | "italic"
}

export default function Checkbox(props: ICheckbox) {


    const TextStyle = () => {
        switch (props.textStyle) {
            case "base":
                return "font-manrope-semibold text-sm"
            case "italic":
                return "italic text-sm text-neutral-500";
            default:
                return "";
        }
    }

    return (
        <div className="flex w-max items-center gap-2">
            <input className="accent-neutral-600" type="checkbox" defaultChecked={props.default} onChange={e => props.onChange(e.target.checked)} />
            <label className={TextStyle()} >{props.name}</label>
        </div>
    )
}