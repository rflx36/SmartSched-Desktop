



interface ISwitchOption {
    active: number,
    options: Array<string>,
    width?: string,
    onClick: (active: number) => void
}

export default function SwitchOption(props: ISwitchOption) {
    const width = (!!props.width) ? props.width : "w-[115px]";

    return (
        <div className="bg-baseline-border-base h-10 w-max flex rounded-lg m-1  ">
            {props.options.map((x, i) => {
                return (i == props.active) ? <SwitchActive text={x} key={i} style={width} /> : <SwitchInactive text={x} key={i} style={width} switch={()=>props.onClick(i)} />;
            })}
        </div>
    )
}

function SwitchActive(props: { text: string, style: string }) {
    return (
        <button className={"h-8 p-[1px] m-[3px] border border-baseline-outline bg-baseline-base rounded-md grid place-content-center " + props.style}>
            <p className=" font-manrope-semibold text-[16px] text-grey-500">{props.text}</p>
        </button>
    )
}

function SwitchInactive(props: { text: string, style: string, switch: () => void }) {
    return (
        <button onClick={props.switch} className={"h-8 p-[1px] m-[3px] w-max  grid place-content-center  " + props.style}>
            <p className="font-manrope-semibold text-[16px] text-grey-400">{props.text}</p>
        </button>
    )
}