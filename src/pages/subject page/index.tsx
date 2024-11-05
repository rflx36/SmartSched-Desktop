import { useState } from "react";
import { CurrentSemester, Subject, SubjectDetailType, SubjectHasLabLec, YearType } from "../../types/types";
import { useMainScheduleStore } from "../../stores/main_schedule_store";





export default function PageSubjects() {
    const main = useMainScheduleStore();
    const [activeYearTab, setActiveYearTab] = useState(1);
    const [docked, setDocked] = useState<CurrentSemester | null>(null);

    const data = main.get?.inputs.filter(x => x.year == activeYearTab);
    const SwitchYear = (n: number) => {
        setActiveYearTab(n);

        setDocked(null);
    }


    const GetDockedSections = () => {
        if (docked == null) {
            return;
        }
        const docked_section_initial = docked?.year + String.fromCharCode(96 + 1).toUpperCase();
        const docked_section_last = docked?.year + String.fromCharCode(96 + (docked!.sections)).toUpperCase();
        const docked_section_text = (docked!.sections > 1) ? docked_section_initial + " - " + docked_section_last : docked_section_initial;
        return docked_section_text;
    }
    const GetDockedSubjects = () => {
        if (docked == null) {
            return;
        }


        const docked_subject_details: Array<SubjectDetailType> = [];
        for (let i = 0; i < docked.subjects.length; i++) {
            const docked_subject = docked.subjects[i];

            if ((docked_subject as Subject).total_hours == undefined) {
                const docked_subject_detail_lec: SubjectDetailType = {
                    description: docked_subject.title,
                    code: docked_subject.code,
                    hours_allocated: (docked_subject as SubjectHasLabLec).lec_total_hours,
                    is_partitionable: (docked_subject as SubjectHasLabLec).lec_is_dividable,
                    type: "lecture"
                }
                const docked_subject_detail_lab: SubjectDetailType = {
                    description: docked_subject.title,
                    code: docked_subject.code,
                    hours_allocated: (docked_subject as SubjectHasLabLec).lab_total_hours,
                    is_partitionable: (docked_subject as SubjectHasLabLec).lab_is_dividable,
                    type: "labaratory"
                }
                docked_subject_details.push(docked_subject_detail_lec);
                docked_subject_details.push(docked_subject_detail_lab);

            }
            else {
                const docked_subject_detail: SubjectDetailType = {
                    description: docked_subject.title,
                    code: docked_subject.code,
                    hours_allocated: (docked_subject as Subject).total_hours,
                    is_partitionable: (docked_subject as Subject).is_dividable,
                    type: "lecture"
                }
                docked_subject_details.push(docked_subject_detail);
            }
        }
        return docked_subject_details;

    }
    return (
        <div className="w-full flex justify-center">
            <div className="mt-12">

                <p className="ml-1 mb-2 font-manrope-semibold text-grey-900 text-[20px]">Current Subjects in {main.get?.semester} Sem</p>
                <div className="w-max h-max border shadow-inner border-baseline-border-outline bg-baseline-border-base rounded-lg">
                    <div className="m-1 min-w-[1000px] w-input-full ">
                        <div className=" bg-neutral-300 mx-1 mt-2 z-10 overflow-hidden border-b-0 rounded-t-lg w-max  font-manrope-semibold text-sm text-center ">
                            <SetupYearTab isActive={1 == activeYearTab} year="1st" onClick={() => SwitchYear(1)} />
                            <SetupYearTab isActive={2 == activeYearTab} year="2nd" onClick={() => SwitchYear(2)} />
                            <SetupYearTab isActive={3 == activeYearTab} year="3rd" onClick={() => SwitchYear(3)} />
                            <SetupYearTab isActive={4 == activeYearTab} year="4th" onClick={() => SwitchYear(4)} />

                        </div>
                        <div className="w-[calc(100%-8px)] mb-2  drop-shadow-sm  bg-grey-100 mx-1 min-h-[420px] relative h-max rounded-tl-none rounded-lg border border-t-0 border-baseline-outline">
                            <div className="w-full absolute rounded-tl-none rounded-lg h-5 top-[-1px] border-baseline-outline border-t-[1px] "></div>

                            {(docked != null) ?
                                (

                                    <div className="p-2 w-full z-10 h-full ">
                                        <div className="border h-full  border-baseline-outline m-1 flex rounded-lg flex-col">
                                            <div className="hover:bg-grey-50 relative rounded-t-lg h-[62px] w-full flex items-center justify-between">
                                                <div onClick={() => setDocked(null)} className="w-full cursor-pointer h-full  absolute" />
                                                <div className="w-max h-full flex items-center ">

                                                    <div className="w-[90px] h-full flex items-center mx-4 ">
                                                        <p className="font-manrope-semibold text-[20px] text-grey-750" >{docked.course}</p>
                                                    </div>
                                                    <div className="w-[1px] h-1/2 bg-baseline-outline" />

                                                    <div className="w-[150px] h-full mx-4 flex items-center tabular-nums">
                                                        <p className="font-manrope-semibold text-[16px] text-grey-500">{GetDockedSections()}</p>
                                                        <p className="m-1 font-manrope-medium text-grey-400 text-[12px]">({docked.sections} sections)</p>
                                                    </div>
                                                </div>
                                                <div className="w-max  h-full flex items-center justify-end">
                                                    <img className="mx-4 rotate-180" src="icons/icon-arrow.png" />
                                                </div>
                                            </div>
                                            <div className="h-10 w-full flex gap-2  font-manrope-bold text-[14px] justify-between text-grey-900 bg-baseline-border-base border-y border-baseline-outline">
                                                <div className="w-[300px] ml-6 flex items-center">
                                                    <p>Subject Description</p>

                                                </div>
                                                <div className="w-[125px] flex items-center justify-center">
                                                    <p>Subject Code</p>
                                                </div>
                                                <div className="w-[125px] flex items-center justify-center">
                                                    <p>Hours Allocated</p>
                                                </div>
                                                <div className="w-[125px] flex items-center justify-center">
                                                    <p>Is Partitionable</p>
                                                </div>
                                                <div className="w-[125px] flex items-center ">
                                                    <p>Type</p>
                                                </div>

                                            </div>
                                            <div className="min-h-[290px] h-[calc(100vh-460px)] w-full mt-[2px] overflow-y-scroll">
                                                {(GetDockedSubjects != null) && GetDockedSubjects()?.map((x, i) => {
                                                    return (
                                                        <div key={i} className="h-12 w-full flex gap-2 font-manrope-semibold justify-between     text-grey-500 text-[14px] border-b border-baseline-outline">
                                                            <div className="w-[300px] ml-6 flex items-center">
                                                                <p>{x.description}</p>

                                                            </div>
                                                            <div className="w-[125px] flex items-center justify-center">
                                                                <p>{x.code}</p>
                                                            </div>
                                                            <div className="w-[125px] flex items-center justify-center">
                                                                <p>{x.hours_allocated}</p>
                                                            </div>
                                                            <div className="w-[125px] flex items-center justify-center">
                                                                <p>{(x.is_partitionable) ? "Yes" : "No"}</p>
                                                            </div>
                                                            <div className="w-[125px] flex items-center ">
                                                                <p>{x.type}</p>
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                ) :
                                (
                                    <div className="p-2 w-full flex flex-col items-start justify-between h-full z-10">
                                        <div className="  w-full min-h-[350px] h-[calc(100vh-400px)]">


                                            {
                                                ((data?.length || 0) > 0 && data != undefined) ?
                                                    (
                                                        data.map((x, i) => {
                                                            const section_initial = x.year + String.fromCharCode(96 + 1).toUpperCase();
                                                            const section_last = x.year + String.fromCharCode(96 + (x.sections)).toUpperCase();
                                                            const section_text = (x.sections > 1) ? section_initial + " - " + section_last : section_initial;
                                                            return (
                                                                <div key={i} className=" hover:bg-grey-50  relative border-baseline-outline border w-[calc(100%-8px)] m-1 h-16 rounded-lg flex items-center justify-between">
                                                                    <div onClick={() => setDocked(x)} className="w-full cursor-pointer h-full  absolute" />

                                                                    <div className="w-max h-full flex items-center">
                                                                        <div className="w-[90px] h-full flex items-center mx-4 ">
                                                                            <p className="font-manrope-semibold text-[20px] text-grey-750" >{x.course}</p>
                                                                        </div>
                                                                        <div className="w-[1px] h-1/2 bg-baseline-outline" />

                                                                        <div className="w-[150px] h-full mx-4 flex items-center tabular-nums">
                                                                            <p className="font-manrope-semibold text-[16px] text-grey-500">{section_text}</p>
                                                                            <p className="m-1 font-manrope-medium text-grey-400 text-[12px]">({x.sections} sections)</p>
                                                                        </div>
                                                                        <div className="w-[1px] h-1/2 bg-baseline-outline" />
                                                                        <div className="ml-4 w-auto h-full flex items-center gap-2">
                                                                            {x.subjects.map((x, i) => {
                                                                                return (
                                                                                    <div key={i} className="h-[23px] w-max px-4 bg-grey-200 rounded-full flex items-center" title={x.title}>
                                                                                        <p className="font-manrope-medium text-[12px] text-grey-500" >{x.code.toLocaleUpperCase()}</p>
                                                                                    </div>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                    <div className="w-max  h-full flex items-center justify-end ">
                                                                        <img className="mx-4" src="icons/icon-arrow.png" />
                                                                    </div>
                                                                </div>
                                                            )
                                                        })
                                                    )
                                                    :
                                                    (
                                                        <div className="w-full min-h-[350px] grid place-content-center">
                                                            <p className="font-manrope-semibold text-[14px] text-grey-400">No Assigned subjects yet.</p>
                                                        </div>
                                                    )
                                            }
                                        </div>

                                    </div>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}



function SetupYearTab(props: { isActive: boolean, year: string, onClick: () => void }) {
    return (props.isActive) ?
        (
            <button
                className="w-max max-h-20 px-4  pb-1 z-[1] relative pt-1
            before:w-full before:bg-neutral-100 before:h-full before:absolute before:content[''] 
            before:left-0 before:top-0 before:rounded-t-lg before:z-[-1] 
            before:border before:border-neutral-300 before:border-b-0">
                <p >{props.year} year</p>
            </button>
        ) :
        (
            <button className="pt-1 w-max text-neutral-500 px-4 pb-1" onClick={() => props.onClick()}>
                <p>{props.year} year</p>
            </button>
        )
}