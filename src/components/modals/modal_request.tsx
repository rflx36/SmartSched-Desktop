import { push, ref, remove, set } from "firebase/database";
import { useUIStore } from "../../stores/ui_store";
import { realtime_database } from "../../firebase/firebase_config";
import { ConvertValueToTime } from "../../core/utils/time_converter";












export default function ModalRequest() {
    const ui_state = useUIStore();

    const Close = () => {
        ui_state.get.modal = "closed";
        ui_state.get.modal_request = null;
        ui_state.set();
    }


    const Reject = async () => {
        const id = ui_state.get.modal_request?.id;
        const uid = ui_state.get.modal_request?.uid;
        const room = ui_state.get.modal_request?.room;
        const requestRef = ref(realtime_database, `schedule/request/${id}`);
        const hours = new Date().getHours();
        const minutes = new Date().getMinutes();
        const getTodayDate = () => {
            const today = new Date();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const year = String(today.getFullYear()).slice(-2);
            return `${month}-${day}-${year}`;
        };
        await remove(requestRef)
            .then(async () => {
                ui_state.get.modal = "closed";
                ui_state.get.modal_request = null;
                ui_state.set();
            })
            .catch((error) => {
                console.error(`Error deleting schedule/request/${id}:`, error);
            });

        try {
            await push(ref(realtime_database, `schedule/response/`), {
                message: "Request for " + room + " Rejected",
                uid: uid,
                time_rejected: ConvertValueToTime(((hours * 60) + minutes)),
                day_validity: getTodayDate()
            })
        }
        catch (err) {
            console.error(err);
        }


    }
    const Accept = async () => {
        const id = ui_state.get.modal_request?.id;
        const uid = ui_state.get.modal_request?.uid;
        const room = ui_state.get.modal_request?.room;
        const time_start = ui_state.get.modal_request?.time_start;
        const time_end = ui_state.get.modal_request?.time_end;
        const name = ui_state.get.modal_request?.name;
        const section = ui_state.get.modal_request?.section;

        const requestRef = ref(realtime_database, `schedule/request/${id}`);
        const hours = new Date().getHours();
        const minutes = new Date().getMinutes();
        const getTodayDate = () => {
            const today = new Date();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');
            const year = String(today.getFullYear()).slice(-2);
            return `${month}-${day}-${year}`;
        };
        await remove(requestRef)
            .then(async () => {
                ui_state.get.modal = "closed";
                ui_state.get.modal_request = null;
                ui_state.set();
            })
            .catch((error) => {
                console.error(`Error deleting schedule/request/${id}:`, error);
            });
        try {
            await push(ref(realtime_database, `schedule/accepted/`), {
                message: "Your request for " + room + " is confirmed",
                uid: uid,
                time_accepted: ConvertValueToTime(((hours * 60) + minutes)),
                day_validity: getTodayDate(),
                room: room,
                time_start: time_start,
                time_end: time_end,
                name: name,
                section: section

            })
        }
        catch (err) {
            console.error(err);
        }
    }

    const ConvertTime = (x: string) => {
        const [hours, minutes] = x.split(":");

        const hours_value = parseInt(hours);

        const ampm = hours_value >= 12 ? "PM" : "AM";

        const hours_format = hours_value % 12 || 12;
        return `${hours_format}:${minutes} ${ampm}`;
    }

    return (
        <div className="relative w-[500px] h-[460px] bg-grey-100 outline outline-1 outline-neutral-600/10 rounded-lg z-50 px-4 py-2">
            <button
                onClick={Close}
                className="hover:bg-neutral-400/75 size-3 rounded-full p-2 absolute top-2 right-2 bg-neutral-300 grid place-content-center bg-[url('icons/icon-close.png')] bg-no-repeat bg-center bg-[length:10px_10px]" >
            </button>
            <div className="w-full h-full flex justify-between flex-col ">

                <div className=" font-manrope-semibold text-grey-500  mt-2">
                    <div className="flex w-full gap-2">

                        <div className="mt-2 w-full rounded-lg bg-neutral-200/75 ">
                            <label className="text-[12px] font-manrope-bold text-grey-900 translate-y-1 ml-2">Room Requested</label>
                            <div className="h-7 -translate-y-[2px] rounded-md items-center flex px-2 py-[4px]">
                                <p>{ui_state.get.modal_request?.room}</p>
                            </div>
                        </div>

                        <div className="mt-2 w-full rounded-lg bg-neutral-200/75 ">
                            <label className="text-[12px] font-manrope-bold text-grey-900 translate-y-1 ml-2">Requested at</label>
                            <div className="h-7 -translate-y-[2px] rounded-md items-center flex px-2 py-[4px]">
                                <p>{ConvertTime(ui_state.get.modal_request?.time_requested || "00:00")}</p>
                            </div>
                        </div>
                    </div>

                    <div className="my-2 rounded-lg bg-neutral-200/75 ">
                        <label className="text-[12px] font-manrope-bold text-grey-900 translate-y-1 ml-2">Name</label>
                        <div className="h-7 -translate-y-[2px] rounded-md items-center flex px-2 py-[4px]">
                            <p>{ui_state.get.modal_request?.name}</p>
                        </div>
                    </div>
                    <div className="my-2 rounded-lg bg-neutral-200/75 ">
                        <label className="text-[12px] font-manrope-bold text-grey-900 translate-y-1 ml-2">Section</label>
                        <div className="h-7 -translate-y-[2px] rounded-md items-center flex px-2 py-[4px]">
                            <p>{ui_state.get.modal_request?.section}</p>
                        </div>
                    </div>
                    <div className="my-2 rounded-lg bg-neutral-200/75 ">
                        <label className="text-[12px] font-manrope-bold text-grey-900 translate-y-1 ml-2">Time</label>
                        <div className="h-7  -translate-y-[2px] rounded-md items-center flex px-2 py-[4px]">
                            <p>{ui_state.get.modal_request?.time_start} - {ui_state.get.modal_request?.time_end}</p>
                        </div>
                    </div>
                    <div className="my-2 rounded-lg bg-neutral-200/75 ">
                        <label className="text-[12px] font-manrope-bold text-grey-900 translate-y-1 ml-2">Message</label>
                        <div className="h-[100px]  -translate-y-[2px] rounded-md items-start flex px-2 py-[4px]">
                            <p>{ui_state.get.modal_request?.message}</p>
                        </div>
                    </div>
                </div>

                <div className="w-full flex gap-2 mb-1 ">
                    <button
                        onClick={Reject}
                        className="hover:text-invalid hover:bg-invalid/10 hover:border-invalid/50 h-[40px] rounded-2xl w-full m-1 bg-neutral-90 border border-neutral-300  outline-neutral-200/80 outline-[4px]  px-4 py-1 outline   text-neutral-500  ease-out"
                    >
                        <p className="font-manrope-semibold ">Reject</p>
                    </button>

                    <button
                        onClick={Accept}
                        className="hover:text-green-600 hover:bg-green-600/10 hover:border-green-600/50 h-[40px] rounded-2xl w-full m-1 bg-neutral-90 border border-neutral-300  outline-neutral-200/80 outline-[4px]  px-4 py-1 outline   text-neutral-500  ease-out"
                    >
                        <p className="font-manrope-semibold ">Approve</p>
                    </button>
                </div>
            </div>

        </div>
    )


}