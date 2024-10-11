

interface IChip {
    text: string,
    title: string,
    onRemove: () => void,
    onClick?: () => void
}



export default function Chip(props: IChip) {

    return (
        <div title={"(Click to edit) "+props.title} className="relative  animate-popOut pl-3 pr-2 py-1 h-max border border-neutral-300 hover:border-grey-400 bg-neutral-200/50 rounded-full flex items-center justify-between gap-2">
            <div onClick={props.onClick} className=" cursor-pointer absolute w-[calc(100%-30px)]  h-full left-0"/>
            <p className="align-middle text-neutral-500 font-manrope-semibold text-sm " >{props.text}</p>
            <button onClick={props.onRemove} className="opacity-50 hover:bg-neutral-300 size-3 rounded-full p-2   grid place-content-center bg-[url('icons/icon-close.png')] bg-no-repeat bg-center bg-[length:10px_10px]"></button>
        </div>
    )

}