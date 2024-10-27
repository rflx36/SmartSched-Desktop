import Baseline from "../../../components/baseline";
import Border from "../../../components/border";
import CheckInputsEligibility from "../../../core/utils/check_inputs_eligibility"
import { useInstructorStore } from "../../../stores/instructor_store";
import { useSectionStore } from "../../../stores/section_store";
import { useSessionStore } from "../../../stores/session_store"
import { useUIStore } from "../../../stores/ui_store";
import { ICSP } from "../../../types/core_types"



export default function SetupStep_3() {
    const class_session = useSessionStore();
    const class_section = useSectionStore();
    const class_instructors = useInstructorStore();

    const inputs: ICSP = {
        time_start: class_session.get.time_start,
        time_end: class_session.get.time_end,
        break_time_start: class_session.get.break_time_start,
        break_time_end: class_session.get.break_time_end,
        instructors: class_instructors.get.instructors,
        courses: class_session.get.courses,
        rooms: class_session.get.rooms.filter(x => !x.is_realtime).map(x => x.room_name),
        rooms_lab: class_session.get.rooms.filter(x => x.is_realtime).map(x => x.room_name),
        data: class_section.get.data
    }
    const result = CheckInputsEligibility(inputs);
    return (
        (result.is_eligible) ?
            <GenerationTweaksContainer /> :
            <InvalidContainer
                instructors_available={result.instructor_hours_available}
                hours_available={result.room_hours_available}
                hours_occupied={result.subject_hours_occupied}
                subjects_available={result.subjects_available}
                rooms_amount={class_session.get.rooms.length}
                instructors_amount={class_instructors.get.instructors.length}
            />
    )
}




function InvalidContainer(props: { instructors_available: number, hours_available: number, hours_occupied: number, subjects_available: number, rooms_amount: number, instructors_amount: number }) {
    const ui_state = useUIStore();
    const max_hours_free_per_room = props.hours_available / props.rooms_amount;
    const invalid_requirement_room = props.hours_available < props.hours_occupied;
    const invalid_requirement_instructors = props.instructors_available < props.hours_occupied;

    const RedirectToStep0 = () => {
        ui_state.get.sidebar_setup_step = 0;
        ui_state.set();
    }

    const RedirectToStep2 = () => {
        ui_state.get.sidebar_setup_step = 2;
        ui_state.set();
    }
    return (
        <>
            <p className="ml-1 font-manrope-semibold text-grey-900 text-[20px]">Inputs are not Eligible</p>
            <Border>
                <Baseline>
                    <div className="w-[492px] min-h-[440px] ">
                        <div className="text-[14px] text-grey-500 font-manrope-semibold w-[calc(100%-32px)] m-4 h-max">
                            <p>{props.instructors_amount} Instructor{(props.instructors_amount > 1) && "s"} Avaiable</p>
                            <p>{props.rooms_amount} Room{(props.rooms_amount > 1) && "s"} Available</p>
                            <p >{max_hours_free_per_room} Max Hour{(max_hours_free_per_room > 1) && "s"} free per room</p>
                            {/* instructors total free hours */}
                            <p className={(invalid_requirement_room) ? "text-invalid" : ""}>{props.hours_available} Total Hour{(props.hours_available > 1) && "s"} of available room </p>
                            <p className={(invalid_requirement_instructors) ? "text-invalid" : ""}>{props.instructors_available} Total Hour{(props.hours_available > 1) && "s"} of available instructors</p>
                            <p className="text-invalid">{props.hours_occupied} Total Hour{(props.hours_occupied > 1) && "s"} of subjects to be assigned</p>
                        </div>
                        <p className="mt-8 mb-4 text-grey-500 font-manrope-semibold m-4 h-max text-[14px]">Here's what you can do:</p>
                        {(invalid_requirement_room) && (
                            <>
                                <div onClick={RedirectToStep0} className="w-[calc(100%-32px)] flex place-items-center justify-between h-[60px] rounded-lg hover:bg-grey-200 bg-grey-150 mx-4 mb-4 cursor-pointer">
                                    <h1 className="text-[20px] font-manrope-semibold text-grey-500 ml-4">Increase School Hours</h1>
                                    <img src="icons/icon-arrow.png" className="-rotate-90 mr-4" />
                                </div>
                                <div onClick={RedirectToStep0} className="w-[calc(100%-32px)] flex place-items-center justify-between h-[60px] rounded-lg hover:bg-grey-200 bg-grey-150 mx-4 mb-4 cursor-pointer">
                                    <h1 className="text-[20px] font-manrope-semibold text-grey-500 ml-4">Add more Rooms</h1>
                                    <img src="icons/icon-arrow.png" className="-rotate-90 mr-4" />
                                </div>
                            </>
                        )}
                        {(invalid_requirement_instructors) && (
                            <div onClick={RedirectToStep2} className="w-[calc(100%-32px)] flex place-items-center justify-between h-[60px] rounded-lg hover:bg-grey-200 bg-grey-150 mx-4 mb-4 cursor-pointer">
                                <h1 className="text-[20px] font-manrope-semibold text-grey-500 ml-4">Add or Adjust Instructors </h1>
                                <img src="icons/icon-arrow.png" className="-rotate-90 mr-4" />
                            </div>
                        )}
                    </div>
                </Baseline>
            </Border>
        </>
    )
}

function GenerationTweaksContainer() {
    const ui_state = useUIStore();
    const RedirectToGenerated = () => {
        ui_state.get.sidebar_setup_step = 4;
        ui_state.set();
    }

    return (
        <>
            <p className="ml-1 font-manrope-semibold text-grey-900 text-[20px]">Finishing Up</p>
            <Border>
                <Baseline>
                    <div className="w-[492px] min-h-[440px] flex flex-col justify-between ">
                        <div className="">

                        </div>
                        <div className="grid place-content-center mb-5">
                            <button onClick={RedirectToGenerated} className="w-52 h-12  border-4 border-grey-200 rounded-[10px] grid place-content-center" >
                                <div className=" w-[200px] grid place-content-center rounded-md bg-[linear-gradient(90deg,rgba(233,170,150,0.5)_0%,rgba(193,133,162,0.5)_48%,rgba(105,98,173,0.5)_100%)]  h-10">
                                    <div className="w-[196px] rounded-[4px] h-9 grid place-content-center bg-baseline-base hover:bg-opacity-75 ease-bezier-in duration-100">
                                        <p className="bg-gradient-to-r from-[#e9aa96] via-[#c185a2] to-[#6962ad] text-[20px] font-manrope-bold bg-clip-text text-transparent">Generate</p>
                                    </div>
                                </div>
                            </button>

                        </div>
                    </div>
                </Baseline>
            </Border>
        </>
    )
}