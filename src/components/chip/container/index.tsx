




export default function ChipContainer(props: React.PropsWithChildren) {
    return (
        <div className=" max-w-full min-h-20 flex flex-wrap flex-row gap-2 ">
            {props.children}
        </div>
    )
}