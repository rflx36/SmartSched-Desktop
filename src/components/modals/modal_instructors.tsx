import { useState } from "react";
import { useUIStore } from "../../stores/ui_store";
import Baseline from "../baseline";
import Input from "../input";
import Checkbox from "../checkbox";
import Button from "../button";
import Dropdown, { IOptions } from "../dropdown";
import { useSectionStore } from "../../stores/section_store";
import { CurrentSemester, InstructorType, TimeType, WeekType } from "../../types/types";
import ChipContainer from "../chip/container";
import Chip from "../chip";
import { useInstructorStore } from "../../stores/instructor_store";
import { useSessionStore } from "../../stores/session_store";
import { ConvertTimeToValue } from "../../core/utils/time_converter";






export default function ModalInstructors() {
    const ui_state = useUIStore();
    const section = useSectionStore();
    const session = useSessionStore();
    const instructors = useInstructorStore();

    const default_time_start = session.get.time_start;
    const default_time_end = session.get.time_end;

    const Modifying = ui_state.get.modal_edit_instructors;
    const default_first_name = (Modifying) ? Modifying.first_name : "";
    const default_last_name = (Modifying) ? Modifying.last_name : "";
    const default_is_full_time = (Modifying) ? Modifying.fulltime : true;
    const default_subjects = (Modifying) ? Modifying.preffered_subjects.map(x => x.code) : [];

    const default_use_monday = true;
    const default_use_tuesday = (Modifying?.tuesday) ? true : false;
    const default_use_wednesday = (Modifying?.wednesday) ? true : false;
    const default_use_thursday = (Modifying?.thursday) ? true : false;
    const default_use_friday = (Modifying?.friday) ? true : false;
    const default_use_saturday = (Modifying?.saturday) ? true : false;

    const default_monday_start = (Modifying?.monday) ? Modifying.monday.time_start : default_time_start;
    const default_monday_end = (Modifying?.monday) ? Modifying.monday.time_end : default_time_end;
    const default_tuesday_start = (Modifying?.tuesday) ? Modifying.tuesday.time_start : default_time_start;
    const default_tuesday_end = (Modifying?.tuesday) ? Modifying.tuesday.time_end : default_time_end;
    const default_wednesday_start = (Modifying?.wednesday) ? Modifying.wednesday.time_start : default_time_start;
    const default_wednesday_end = (Modifying?.wednesday) ? Modifying.wednesday.time_end : default_time_end;
    const default_thursday_start = (Modifying?.thursday) ? Modifying.thursday.time_start : default_time_start;
    const default_thursday_end = (Modifying?.thursday) ? Modifying.thursday.time_end : default_time_end;
    const default_friday_start = (Modifying?.friday) ? Modifying.friday.time_start : default_time_start;
    const default_friday_end = (Modifying?.friday) ? Modifying.friday.time_end : default_time_end;
    const default_saturday_start = (Modifying?.saturday) ? Modifying.saturday.time_start : default_time_start;
    const default_saturday_end = (Modifying?.saturday) ? Modifying.saturday.time_end : default_time_end;


    const [firstName, setFirstName] = useState(default_first_name);
    const [lastName, setLastName] = useState(default_last_name);
    const [isFullTime, setIsFullTime] = useState(default_is_full_time);
    const [currentSubjectSelection, setCurrentSubjectSelection] = useState<IOptions | undefined>();
    const [UIStep, setUIStep] = useState(1);
    //({ value: e.code, label: e.name })

    const [useMonday, setUseMonday] = useState(default_use_monday);
    const [useTuesday, setUseTuesday] = useState(default_use_tuesday);
    const [useWednesday, setUseWednesday] = useState(default_use_wednesday);
    const [useThursday, setUseThursday] = useState(default_use_thursday);
    const [useFriday, setUseFriday] = useState(default_use_friday);
    const [useSaturday, setUseSaturday] = useState(default_use_saturday);


    const [mondayStart, setMondayStart] = useState<TimeType>(default_monday_start);
    const [mondayEnd, setMondayEnd] = useState<TimeType>(default_monday_end);

    const [tuesdayStart, setTuesdayStart] = useState<TimeType>(default_tuesday_start);
    const [tuesdayEnd, setTuesdayEnd] = useState<TimeType>(default_tuesday_end);

    const [wednesdayStart, setWednesdayStart] = useState<TimeType>(default_wednesday_start);
    const [wednesdayEnd, setWednesdayEnd] = useState<TimeType>(default_wednesday_end);

    const [thursdayStart, setThursdayStart] = useState<TimeType>(default_thursday_start);
    const [thursdayEnd, setThursdayEnd] = useState<TimeType>(default_thursday_end);

    const [fridayStart, setFridayStart] = useState<TimeType>(default_friday_start);
    const [fridayEnd, setFridayEnd] = useState<TimeType>(default_friday_end);

    const [saturdayStart, setSaturdayStart] = useState<TimeType>(default_saturday_start);
    const [saturdayEnd, setSaturdayEnd] = useState<TimeType>(default_saturday_end);

    const [prefferedSubjects, setPrefferedSubjects] = useState<Array<string>>(default_subjects);


    const subjects_data = section.get.data.map((e: CurrentSemester) => e.subjects);


    // const subjects = sem.map((e:Subject | SubjectHasLabLec) => ({ value: e.code, label: e.title}))
    // const result = sem.map((e: Subject | SubjectHasLabLec) => {
    //     return { value: e.code, label: e.title };
    // });



    const subjects_list = subjects_data.flat().map(e => ({ value: e.code, label: e.title }));
    const subject_available_list = [...new Set(subjects_list.filter(e => !prefferedSubjects.includes(e.value)))];

    const AddPreferred = () => {
        if (currentSubjectSelection == undefined) {
            return;
        }

        setPrefferedSubjects(x => [...x, currentSubjectSelection!.value]);
        setCurrentSubjectSelection(undefined);
    }
    const Proceed = () => {
        setUIStep(2);
    }
    const Finish = () => {

        if (Modifying) {
            const instructor_index = instructors.get.instructors.findIndex(x => x == Modifying);

            instructors.get.instructors[instructor_index] = {
                first_name: firstName,
                last_name: lastName,
                fulltime: isFullTime,
                preffered_subjects: [...new Set(subjects_data.flat().filter(e => prefferedSubjects.includes(e.code)))],
                ...(useMonday && { monday: { time_start: mondayStart, time_end: mondayEnd } }),
                ...(useTuesday && { tuesday: { time_start: tuesdayStart, time_end: tuesdayEnd } }),
                ...(useWednesday && { wednesday: { time_start: wednesdayStart, time_end: wednesdayEnd } }),
                ...(useThursday && { thursday: { time_start: thursdayStart, time_end: thursdayEnd } }),
                ...(useFriday && { friday: { time_start: fridayStart, time_end: fridayEnd } }),
                ...(useSaturday && { saturday: { time_start: saturdayStart, time_end: saturdayEnd } }),
            }

        }
        else {
            const current_instructor: InstructorType = {
                first_name: firstName,
                last_name: lastName,
                fulltime: isFullTime,
                preffered_subjects: [... new Set(subjects_data.flat().filter(e => prefferedSubjects.includes(e.code)))],
                ...(useMonday && { monday: { time_start: mondayStart, time_end: mondayEnd } }),
                ...(useTuesday && { tuesday: { time_start: tuesdayStart, time_end: tuesdayEnd } }),
                ...(useWednesday && { wednesday: { time_start: wednesdayStart, time_end: wednesdayEnd } }),
                ...(useThursday && { thursday: { time_start: thursdayStart, time_end: thursdayEnd } }),
                ...(useFriday && { friday: { time_start: fridayStart, time_end: fridayEnd } }),
                ...(useSaturday && { saturday: { time_start: saturdayStart, time_end: saturdayEnd } }),
            }
            instructors.get.instructors.push(current_instructor);


        }

        instructors.set();

        ui_state.get.modal = "closed";
        ui_state.set();

        setFirstName("");
        setLastName("");
        setIsFullTime(true);
        setPrefferedSubjects([]);

    }

    const Close = () => {
        ui_state.get.modal = "closed";

        ui_state.get.modal_edit_instructors = null;
        ui_state.set();
    }

    const ValidateSchedule = () => {
        if (useMonday) {
            if ((ConvertTimeToValue(mondayEnd) - ConvertTimeToValue(mondayStart)) < 0) {
                return false;
            }
        }
        if (useTuesday) {
            if ((ConvertTimeToValue(tuesdayEnd) - ConvertTimeToValue(tuesdayStart)) < 0) {
                return false;
            }
        }
        if (useWednesday) {
            if ((ConvertTimeToValue(wednesdayEnd) - ConvertTimeToValue(wednesdayStart)) < 0) {
                return false;
            }
        }
        if (useThursday) {
            if ((ConvertTimeToValue(thursdayEnd) - ConvertTimeToValue(thursdayStart)) < 0) {
                return false;
            }
        }
        if (useFriday) {
            if ((ConvertTimeToValue(fridayEnd) - ConvertTimeToValue(fridayStart)) < 0) {
                return false;
            }
        }
        if (useSaturday) {
            if ((ConvertTimeToValue(saturdayEnd) - ConvertTimeToValue(saturdayStart)) < 0) {
                return false;
            }
        }
        return true;
    }


    const isEligibleToProceed = firstName != "" && lastName != "" && (useMonday || useTuesday || useWednesday || useThursday || useFriday || useSaturday) && ValidateSchedule();;
    return (
        <div className="relative size-max bg-grey-100 outline outline-1 outline-neutral-600/10 rounded-lg z-50 px-4 py-2">
            <button
                onClick={Close}
                className="hover:bg-neutral-400/75 size-3 rounded-full p-2 absolute top-2 right-2 bg-neutral-300 grid place-content-center bg-[url('icons/icon-close.png')] bg-no-repeat bg-center bg-[length:10px_10px]" >
            </button>

            <div className="w-[420px] font-manrope-semibold text-sm mb-1 text-neutral-500 flex">
                {(UIStep == 2) ?
                    (
                        <>
                            <button className="mr-2" onClick={() => setUIStep(1)}>
                                <p>Back</p>
                            </button>
                            <p>{firstName} {lastName}</p>
                        </>
                    ) :
                    (
                        <p>{Modifying ? "Editing" : "Add"} Instructors</p>
                    )
                }

            </div>

            {
                (UIStep == 1) ?
                    (
                        <div className=" w-max">
                            <Baseline widthFull>
                                <div className="flex">
                                    <Input label="First Name" type="text" value={firstName} onChange={x => setFirstName(x)} />
                                    <Input label="Last Name" type="text" value={lastName} onChange={x => setLastName(x)} />
                                </div>
                                <div className="mx-1">
                                    <Checkbox name="Is Full Time" checked={isFullTime} onClick={(e) => setIsFullTime(e)} />
                                </div>
                            </Baseline>
                            <p className="font-manrope-semibold text-sm text-grey-500 my-1"> Availability</p>
                            <Baseline widthFull>
                                <div className=" m-1 w-[350px] gap-3 flex font-manrope-semibold text-sm mb-1">

                                    <div className="w-[100px] text-center ">
                                        <p>Weekday</p>
                                    </div>
                                    <div className="w-[104px] text-center ">
                                        <p>Time Start</p>

                                    </div>
                                    <div className="w-[104px] ml-4 text-center ">
                                        <p>Time End</p>
                                    </div>

                                </div>
                                <div className="m-1 w-[calc(100%-8px)] flex flex-col">
                                    <AvailabilityContainer
                                        weekday="monday"
                                        is_enabled={useMonday}
                                        time_start_value={mondayStart}
                                        time_end_value={mondayEnd}
                                        time_start_on_change={x => setMondayStart(x)}
                                        time_end_on_change={x => setMondayEnd(x)}
                                        set_enabled={x => setUseMonday(x)}
                                    />
                                    <AvailabilityContainer
                                        weekday="tuesday"
                                        is_enabled={useTuesday}
                                        time_start_value={tuesdayStart}
                                        time_end_value={tuesdayEnd}
                                        time_start_on_change={x => setTuesdayStart(x)}
                                        time_end_on_change={x => setTuesdayEnd(x)}
                                        set_enabled={x => setUseTuesday(x)}
                                    />
                                    <AvailabilityContainer
                                        weekday="wednesday"
                                        is_enabled={useWednesday}
                                        time_start_value={wednesdayStart}
                                        time_end_value={wednesdayEnd}
                                        time_start_on_change={x => setWednesdayStart(x)}
                                        time_end_on_change={x => setWednesdayEnd(x)}
                                        set_enabled={x => setUseWednesday(x)}
                                    />
                                    <AvailabilityContainer
                                        weekday="thursday"
                                        is_enabled={useThursday}
                                        time_start_value={thursdayStart}
                                        time_end_value={thursdayEnd}
                                        time_start_on_change={x => setThursdayStart(x)}
                                        time_end_on_change={x => setThursdayEnd(x)}
                                        set_enabled={x => setUseThursday(x)}
                                    />
                                    <AvailabilityContainer
                                        weekday="friday"
                                        is_enabled={useFriday}
                                        time_start_value={fridayStart}
                                        time_end_value={fridayEnd}
                                        time_start_on_change={x => setFridayStart(x)}
                                        time_end_on_change={x => setFridayEnd(x)}
                                        set_enabled={x => setUseFriday(x)}
                                    />
                                    <AvailabilityContainer
                                        weekday="saturday"
                                        is_enabled={useSaturday}
                                        time_start_value={saturdayStart}
                                        time_end_value={saturdayEnd}
                                        time_start_on_change={x => setSaturdayStart(x)}
                                        time_end_on_change={x => setSaturdayEnd(x)}
                                        set_enabled={x => setUseSaturday(x)}
                                    />
                                </div>
                            </Baseline>
                            <div className="w-full flex justify-end mt-2">
                                <Button text="Proceed" widthType="large" onClick={Proceed} isDisabled={!isEligibleToProceed} />
                            </div>
                        </div>
                    )
                    :
                    (
                        <>
                            <div className="w-[420px] h-full">

                                <Baseline widthFull >
                                    <div className="flex items-end justify-between ">
                                        <div className="flex-grow">
                                            <Dropdown label="Preffered Subjects" options={subject_available_list} onChange={x => setCurrentSubjectSelection(x)} value={currentSubjectSelection} />
                                        </div>
                                        <Button text="Add Subject" onClick={AddPreferred} />
                                    </div>

                                    <hr className="my-4"></hr>
                                    <ChipContainer>
                                        {prefferedSubjects.map((e, i) => {

                                            const RemovePrefferedSubject = () => {
                                                setPrefferedSubjects(subjects => subjects.filter((_, index) => i !== index))
                                            }

                                            return <Chip key={i} text={e} title={e} onRemove={RemovePrefferedSubject} />

                                        }
                                        )}
                                    </ChipContainer>
                                </Baseline>
                            </div>
                            <div className="w-full flex justify-end mt-2">
                                <Button text="Finish" widthType="large" onClick={Finish} />
                            </div>
                        </>
                    )

            }


        </div>
    )
}

interface IAvailabilityContainer {
    weekday: WeekType
    is_enabled: boolean,
    set_enabled: (x: boolean) => void,
    time_start_value: TimeType | null,
    time_end_value: TimeType | null,
    time_start_on_change: (x: any) => void,
    time_end_on_change: (x: any) => void
}


function AvailabilityContainer(props: IAvailabilityContainer) {

    const Enable = () => {
        props.set_enabled(true);
    }
    const Disable = () => {
        props.set_enabled(false);
    }

    const text = props.weekday.charAt(0).toUpperCase() + props.weekday.slice(1)
    if (props.is_enabled) {
        return (
            <div className="w-full h-[50px] mb-2 rounded-lg   flex items-center font-manrope-medium ">
                <p className="w-[90px]  mx-3 text-grey-500 ">{text}</p>
                <Input id="hide-time" size="small" type="time" value={props.time_start_value!.toString()} onChange={x => props.time_start_on_change(x as TimeType)} />
                <div className="w-2" />
                <Input id="hide-time" size="small" type="time" value={props.time_end_value!.toString()} onChange={x => props.time_end_on_change(x as TimeType)} />
                <div className="w-max ml-2 h-[38px] flex items-center hover:bg-grey-150 rounded-md ">
                    <button onClick={Disable} className="outline-none size-[38px]   bg-center bg-origin-content bg-no-repeat  bg-[url('icons/icon-delete.png')] hover:bg-[url('icons/icon-delete-hovered.png')] " />
                </div>
            </div>
        )
    }
    else {
        return (

            <button onClick={Enable} className="hover:bg-grey-200 bg-grey-150 text-grey-600 hover:text-grey-950 w-full h-[50px] mb-2 rounded-lg  ">
                <p className="font-manrope-medium text-sm">Add {text}</p>
            </button>
        )
    }
}