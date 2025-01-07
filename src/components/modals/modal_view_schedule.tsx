import { ConvertTimeToValue, RevertTime } from "../../core/utils/time_converter";
import { useUIStore } from "../../stores/ui_store";






export default function ModalViewListed() {
    const ui_state = useUIStore();


    const Close = () => {
        ui_state.get.modal = "closed";
        ui_state.get.modal_view_listed = null;
        ui_state.set();
    }


    const ExtractTimeToValue = (x: string) => {
        const parts = x.split("-").map(part => part.trim());

        const time = RevertTime(parts[0]);

        return ConvertTimeToValue(time);
    }

    console.log(ui_state.get.modal_view_listed);
    const list_sorted = ui_state.get.modal_view_listed!.allocated_list.sort((a, b) => ExtractTimeToValue(a.time) - ExtractTimeToValue(b.time));
    return (
        <div className="relative w-[700px] h-[460px] bg-grey-100 outline outline-1 outline-neutral-600/10 rounded-lg z-50 px-4 py-2">
            <button
                onClick={Close}
                className="hover:bg-neutral-400/75 size-3 rounded-full p-2 absolute top-2 right-2 bg-neutral-300 grid place-content-center bg-[url('icons/icon-close.png')] bg-no-repeat bg-center bg-[length:10px_10px]" >
            </button>
            <div className="w-full mt-6 h-max border border-baseline-outline px-2 py-1 rounded-md">
                <div className="flex ">
                    <p className="font-manrope-semibold w-1/2">Room: {ui_state.get.modal_view_listed!.room_name}</p>
                    <div className="flex">
                        <p className="font-manrope-semibold">Room Status:
                            <span className={((ui_state.get.modal_view_listed!.is_available) ? "text-[#2ac739]" : "text-invalid") + " ml-1 font-manrope-semibold"}>
                                {(ui_state.get.modal_view_listed!.is_available) ? "Available" : "Unavailable"}
                            </span>
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full mt-2 border h-[370px] overflow-y-scroll border-baseline-outline rounded-md">
                <div className="w-full flex h-[30px] items-center bg-grey-200 border-b border-b-baseline-outline">
                    <p className="font-manrope-semibold text-[14px] text-center w-[207px] ml-2">Instructor</p>
                    <p className="font-manrope-semibold text-[14px] text-center w-[120px] ">Section</p>
                    <p className="font-manrope-semibold text-[14px] text-center w-[140px] ">Subject</p>
                    <p className="font-manrope-semibold text-[14px] text-center w-[195px]  ">Time</p>
                </div>
                {
                    list_sorted.map((x, i) =>
                        <ScheduleDetailCard instructor={x.instructor} section={x.section} subject={x.subject} time={x.time} key={i} />
                    )
                }
            </div>

        </div>
    )
}


function ScheduleDetailCard(props: { instructor: string, section: string, subject: string, time: string }) {

    return (
        <div className="border-b border-baseline-outline h-[40px] items-center w-full flex">
            <p className="font-manrope-semibold text-[14px] text-grey-500 text-center w-[207px] ml-2">{props.instructor}</p>
            <p className="font-manrope-semibold text-[14px] text-grey-500 text-center w-[120px] ">{props.section}</p>
            <p className="font-manrope-semibold text-[14px] text-grey-500 text-center w-[140px] ">{props.subject}</p>
            <p className="font-manrope-semibold text-[14px] text-grey-500  w-[187px] ml-2 ">{props.time}</p>
        </div>
    )
}