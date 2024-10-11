import { useState } from "react";
import { SetupProceedButton } from "..";
import Button from "../../../components/button";
import Modifier from "../../../components/modifier";
import { useInstructorStore } from "../../../stores/instructor_store";
import { useSectionStore } from "../../../stores/section_store";
import { useUIStore } from "../../../stores/ui_store";
import { InstructorType } from "../../../types/types";

export default function SetupStep_2() {
    const ui_state = useUIStore();
    const sections = useSectionStore();
    const instructors = useInstructorStore();
    const [selection, setSelection] = useState<InstructorType | null>(null);

    const SetInstructors = () => {
        ui_state.get.modal = "instructors";
        ui_state.set();
    }

    return (
        <>

            <SetupProceedButton valid={sections.get.data.length > 0} on_press={() => { }} />
            <p className="ml-1 font-manrope-semibold text-grey-900 text-[20px]">Instructors</p>

            <div className=" w-max h-max border shadow-inner border-baseline-border-outline bg-baseline-border-base rounded-lg">
                <div className="m-1 w-input-full min-w-[1000px]   min-h-[449px]  mb-2 ">
                    <div className="m-1 w-[calc(100%-8px)] mt-2 bg-baseline-base rounded-lg border border-baseline-outline">
                        <div className="w-[calc(100%-8px)] h-full m-1 ">
                            <div className="h-[47px] w-[calc(100%-16px)] mx-2 flex items-center justify-between font-manrope-semibold text-grey-900 text-[14px]">
                                <div className="w-[calc(100%-86px)] h-full flex justify-between items-center ">
                                    <div className="w-[225px] ">
                                        <p className="pl-4">Full Name</p>
                                    </div>
                                    <div className="w-[225px]">
                                        <p className="pl-4">Availability</p>
                                    </div>
                                    <div className="w-[100px] grid place-content-center">
                                        <p >Type</p>
                                    </div>
                                    <div className="w-[300px]">
                                        <p >Preffered Subjects</p>
                                    </div>
                                </div>
                                <div className="w-[86px] h-full flex items-center">
                                    <p className="pl-2">Action</p>
                                </div>

                            </div>
                            <div className="w-[calc(100%-16px)] mx-2 min-h-[344px] h-[calc(100vh-406px)]  border border-baseline-outline rounded-lg">
                                {instructors.get.instructors.map((x, i) => {
                                    return (
                                        <div key={i} className="w-full h-[50px] flex justify-between items-center border-b border-baseline-outline font-manrope-semibold text-[14px] text-grey-500">
                                            <div className="w-[calc(100%-86px)] h-full flex justify-between items-center ">
                                                <div className="w-[225px]  ">
                                                    <p className="pl-4">{x.first_name} {x.last_name}</p>
                                                </div>
                                                <div className="w-[225px]  h-full items-center flex justify-between">
                                                    <AvailabilityChip text="M" is_available={x.monday != undefined} />
                                                    <AvailabilityChip text="T" is_available={x.tuesday != undefined} />
                                                    <AvailabilityChip text="W" is_available={x.wednesday != undefined} />
                                                    <AvailabilityChip text="Th" is_available={x.thursday != undefined} />
                                                    <AvailabilityChip text="F" is_available={x.friday != undefined} />
                                                    <AvailabilityChip text="S" is_available={x.saturday != undefined} />
                                                </div>
                                                <div className="w-[100px] grid place-content-center ">
                                                    <p >{(x.fulltime) ? "fulltime" : "tempo"}</p>
                                                </div>
                                                <div className="w-[300px]">

                                                </div>
                                            </div>
                                            <div className="w-[86px] h-full flex items-center">
                                                <Modifier edit={() => { }} delete={() => { }} />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="w-[calc(100%-24px)] mx-3 my-[5px] flex justify-end h-max">
                            <Button text="Add Instructor" onClick={SetInstructors} widthType="large" />
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

function AvailabilityChip(props: { text: string, is_available: boolean }) {

    if (props.is_available) {
        return (
            <div className="size-7 bg-grey-200 grid place-content-center rounded-full font-manrope-bold text-grey-900">
                <p>{props.text}</p>
            </div>
        )
    }
    else {
        return (
            <div className="size-7 bg-grey-200  grid place-content-center rounded-full text-[10px] font-manrope-medium text-grey-300">
                <p>{props.text}</p>
            </div>
        )
    }
}