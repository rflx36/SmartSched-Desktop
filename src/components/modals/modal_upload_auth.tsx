import { useState } from "react";
import { UploadScheduleToMain } from "../../firebase/firebase_upload";
import { useUIStore } from "../../stores/ui_store";
import Input from "../input";
import Button from "../button";
import { useMainScheduleStore } from "../../stores/main_schedule_store";
import { FetchScheduleMain } from "../../firebase/firebase_fetch_main";









export default function ModalUploadAuth() {
    const ui_state = useUIStore();
    const main = useMainScheduleStore();
    const [input, setInput] = useState("");
    const Close = () => {
        ui_state.get.modal = "closed";
        ui_state.set();
    }
    const current_year = new Date().getFullYear();
    const current_semester = ui_state.get.modal_upload_auth?.semester;
    const Confirmed = async () => {
        if (ui_state.get.modal_upload_auth) {
            await UploadScheduleToMain(ui_state.get.modal_upload_auth);

            main.get = await FetchScheduleMain();
            main.set();

        }
        else {
            console.log("Empty Schedule!");
        }
        ui_state.get.modal_upload_auth = null;
        ui_state.get.modal = "closed";
        ui_state.get.sidebar_active = "schedules";
        ui_state.set();

    }
    const key = `ICS ${current_year} ${current_semester} Semester`;

    return (
        <div className="relative  size-max bg-grey-100 outline outline-1 outline-neutral-600/10 rounded-lg z-50 px-4 py-2">
            <button
                onClick={Close}
                className="hover:bg-neutral-400/75 size-3 rounded-full p-2 absolute top-2 right-2 bg-neutral-300 grid place-content-center bg-[url('icons/icon-close.png')] bg-no-repeat bg-center bg-[length:10px_10px]" >
            </button>
            <div className="w-max h-max font-manrope-semibold text-grey-900 text-center">
                <p className="mt-4"> Type <span className="font-manrope-medium text-sm text-grey-750">"{key}"</span> </p>
                <p className="mb-4">to confirm upload</p>
                <Input type="text" value={input} onChange={e => setInput(e)} size="larger" />
                <div className="w-[calc(100%-8px)] mx-1 my-2">
                    <Button text="Confirm" widthType="full" onClick={Confirmed} isDisabled={input != key} />

                </div>
            </div>
        </div>
    )
}