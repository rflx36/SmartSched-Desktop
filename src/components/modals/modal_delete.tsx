import { useUIStore } from "../../stores/ui_store"
import Button from "../button";












export default function ModalDelete(){
    const ui_state = useUIStore();

    const Cancel = () => {
        ui_state.get.modal_action = "cancelled";
        ui_state.get.modal = "closed";
        ui_state.get.modal_message = "";
        ui_state.set();
    }
    const Delete = () => {
        ui_state.get.modal_action = "confirmed";
        ui_state.get.modal ="closed";
        ui_state.get.modal_message = "";
        ui_state.set();
    }

    return (
        <div className="relative size-max bg-grey-100 outline outline-1 outline-neutral-600/10 rounded-lg z-50 px-4 py-2">
             <div className="min-w-[300px] min-h-[100px] flex flex-col justify-between items-center">
                <p className="font-manrope-medium text-invalid mt-2">{ui_state.get.modal_message}</p>
                <p className="font-manrope-medium text-grey-500 my-4 text-[14px]">{ui_state.get.modal_submessage} </p>
                <div className="flex justify-between items-center w-full">
                    <div onClick={Cancel} className="h-8 w-[130px] rounded-md grid place-content-center cursor-pointer hover:bg-grey-200">
                        <p className="font-manrope-medium text-[14px] text-grey-600">Cancel</p>
                    </div>
                    <Button widthType="medium" text="Delete" onClick={Delete}/>
                </div>
             </div>
        </div>
    )
}