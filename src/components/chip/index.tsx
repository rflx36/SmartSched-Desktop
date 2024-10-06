

interface IChip {
    text: string,
    title: string,
    onRemove: () => void
}



export default function Chip(props: IChip) {

    return (
        <div title={props.title} className="animate-popOut pl-3 pr-2 py-1 h-max border border-neutral-300 bg-neutral-200/50 rounded-full flex items-center justify-between gap-2">
            <p className="align-middle text-neutral-500 font-manrope-semibold text-sm " >{props.text}</p>
            <button onClick={props.onRemove} className="opacity-50 hover:bg-neutral-300 size-3 rounded-full p-2   grid place-content-center bg-[url('svgs/icon-close.svg')] bg-no-repeat bg-center bg-[length:10px_10px]"></button>
        </div>
    )

}