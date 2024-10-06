



interface IModifier {
    edit: () => void,
    delete: () => void
}


export default function Modifier(props: IModifier) {

    return (
        <div className="overflow-hidden w-[70px] m-1 bg-baseline-border-base rounded-full h-7 flex justify-between">
            <button onClick={props.edit} className="outline-none w-1/2 hover:bg-grey-300 rounded-md  bg-center bg-origin-content bg-no-repeat  bg-[url('icons/icon-modify.png')] hover:bg-[url('icons/icon-modify-hovered.png')] h-full " />
            <button onClick={props.delete} className="outline-none w-1/2 hover:bg-grey-300 rounded-md  bg-center bg-origin-content bg-no-repeat  bg-[url('icons/icon-delete.png')] hover:bg-[url('icons/icon-delete-hovered.png')] h-full " />

        </div>
    )
}