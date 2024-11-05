import { useMainScheduleStore } from "../../stores/main_schedule_store"
import { useUIStore } from "../../stores/ui_store";






export default function PageDashboard() {
    const main = useMainScheduleStore();
    const ui_state = useUIStore();

    if (main.get == null) {
        return (
            <div className="">
                No Assigned Main Schedule Yet
            </div>
        )
    }

    const instructor_amount = main.get.instructors.length;
    const subjects_amount = main.get.inputs.map(x => x.subjects).flat().length;
    const room_amount = main.get.rooms.length;

    const RedirectInstructors = () => {
        ui_state.get.sidebar_active = "instructors";
        ui_state.set();
    }

    const RedirectSubjects = () => {
        ui_state.get.sidebar_active = "subjects";
        ui_state.set();
    }

    const RedirectSchedules = () => {
        ui_state.get.sidebar_active = "schedules";
        ui_state.set();
    }
    return (
        <>
            <p>{main.get != null && main.get.semester} test here</p>

            <div className="">
                <div >


                    <div className="flex p-1 w-max h-max border  shadow-inner border-baseline-border-outline bg-baseline-border-base rounded-lg">
                        <div onClick={RedirectInstructors} className="hover:scale-[98%] cursor-pointer  ease-bezier-in hover:duration-100 bg-grey-100 border border-grey-300 rounded-[4px] m-1 w-[191px] h-[110px]">
                            <div className="m-4 flex flex-col  h-[calc(100%-32px)] justify-between">
                                <div >
                                    <img src="svg/folder.svg" />
                                    <p className="font-manrope-semibold text-grey-500 mt-2 text-[12px]">Instructors</p>
                                </div>
                                <div className="w-full ">
                                    <div className="w-max rounded-full bg-grey-200 px-4 float-end tabular-nums">
                                        <p className="font-manrope-regular text-[14px]">
                                            {instructor_amount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div onClick={RedirectSubjects} className="hover:scale-[98%] cursor-pointer ease-bezier-in hover:duration-100 bg-grey-100 border border-grey-300 rounded-[4px] m-1 w-[191px] h-[110px]">
                            <div className="m-4 flex flex-col  h-[calc(100%-32px)] justify-between">
                                <div >
                                    <img src="svg/folder.svg" />
                                    <p className="font-manrope-semibold text-grey-500 mt-2 text-[12px]">Subjects</p>
                                </div>
                                <div className="w-full ">
                                    <div className="w-max rounded-full bg-grey-200 px-4 float-end tabular-nums">
                                        <p className="font-manrope-regular text-[14px]">
                                            {subjects_amount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div onClick={RedirectSchedules} className="hover:scale-[98%] cursor-pointer ease-bezier-in hover:duration-100 bg-grey-100 border border-grey-300 rounded-[4px] m-1 w-[191px] h-[110px]">
                            <div className="m-4 flex flex-col  h-[calc(100%-32px)] justify-between">
                                <div >
                                    <img src="svg/folder.svg" />
                                    <p className="font-manrope-semibold text-grey-500 mt-2 text-[12px]">Schedules (Room)</p>
                                </div>
                                <div className="w-full ">
                                    <div className="w-max rounded-full bg-grey-200 px-4 float-end tabular-nums">
                                        <p className="font-manrope-regular text-[14px]">
                                            {room_amount}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}



