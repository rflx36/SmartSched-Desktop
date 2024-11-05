import Button from "../../components/button";
import FilterResult from "../../core/utils/filter_result";
import { useMainScheduleStore } from "../../stores/main_schedule_store"
import { useScheduleStore } from "../../stores/schedule_store";
import { useUIStore } from "../../stores/ui_store";
import { DataFiltered } from "../../types/core_types";





export default function PageInstructor() {
    const main = useMainScheduleStore();
    const schedule = useScheduleStore();
    const ui_state = useUIStore();
    // const filtered_data = FilterResult(2, props.data.result, props.rooms.map(x => x.room_name));

    if (main.get == undefined) {
        return <p>No Official Schedule Yet</p>;
    }

    const filtered_data = FilterResult(2, main.get.data, main.get.rooms.map(x => x.room_name));
    console.log(filtered_data);
    // console.log(main.get.data);
    const ViewSchedule = (x: DataFiltered) => {

        schedule.get.selected = x.filter;
        schedule.get.data = x;
        schedule.get.filter_type = "instructor";
        schedule.get.view_availability = true;
        schedule.set();
        ui_state.get.modal = "schedule";
        ui_state.set();
    }

    return (
        <div className="w-full flex justify-center">
            <div className="mt-12">

                <p className="ml-1 mb-2 font-manrope-semibold text-grey-900 text-[20px]">Current Instructors in {main.get?.semester} Sem</p>
                <div className=" w-max h-max border shadow-inner border-baseline-border-outline bg-baseline-border-base rounded-lg">
                    <div className="m-1 w-input-full min-w-[1000px]   min-h-[449px]  mb-2 ">
                        <div className="m-1 w-[calc(100%-8px)] mt-2 bg-baseline-base rounded-lg border border-baseline-outline">
                            <div className="w-[calc(100%-8px)] h-full m-1 ">
                                <div className="h-[47px] w-[calc(100%-16px)] mx-2 flex items-center justify-between font-manrope-semibold text-grey-900 text-[14px]">
                                    <div className="w-[calc(100%-150px)] h-full flex justify-between items-center ">
                                        <div className="w-[225px] ">
                                            <p className="pl-4">Full Name</p>
                                        </div>
                                        <div className="w-[225px]">
                                            <p className="pl-4">Availability</p>
                                        </div>
                                        <div className="w-[100px] grid place-content-center">
                                            <p >Load (Hours)</p>
                                        </div>
                                        <div className="w-[300px]">
                                            <p className="pl-2" >Assigned Subjects</p>
                                        </div>
                                    </div>
                                    <div className="w-[150px] mr-2 h-full flex items-center">
                                        <p className="text-center w-full">Action</p>
                                    </div>

                                </div>
                                <div className="w-[calc(100%-16px)] mx-2 min-h-[344px] h-[calc(100vh-406px)] overflow-y-scroll border border-baseline-outline rounded-lg">
                                    {main.get?.instructors.map((x, i) => {

                                        // const preffered_subject_1 = x.preffered_subjects[0];
                                        // const preffered_subject_2 = (preffered_subject_1?.code != x.preffered_subjects[1]?.code) ? x.preffered_subjects[1] : (x.preffered_subjects.length > 2) ? x.preffered_subjects[2] : null;
                                        // const preffered_subjects_remaining = ((x.preffered_subjects.length - 3) > 0) ? (x.preffered_subjects.length - 3) : null;
                                        // const filtered = filtered_data.filter(filtered_x => filtered_x.filter == (x.first_name + " " + x.last_name));
                                        // const data_filter = main.get!.data.filter(y => y.instructor.first_name == x.first_name && y.instructor.last_name == x.last_name ); 
                                        // const filtered = FilterResult(2,main.get!.data, main.get!.rooms.map(x => x.room_name));
                                        // const instructor_filtered = filtered.find()
                                        // console.log(data_filter);
                                        // console.log(filtered);
                                        // console.log(x);
                                        // const filtered =
                                        // console.log(x.first_name)
                                        // console.log(main.get?.data);
                                        // console.log(data_filter);
                                        // console.log(filtered);
                                        // console.log(main.get?.data);




                                        if (x.load == 0 || x.load == undefined) {
                                            return (<div key={i}></div>);
                                        }
                                        const filtered = filtered_data.find(y => y.filter == (x.first_name + " " + x.last_name)) as DataFiltered;
                                        const subjects = [];

                                        if (filtered.monday_schedule) {
                                            subjects.push(filtered.monday_schedule.map(x => x.subject));
                                        }
                                        if (filtered.tuesday_schedule) {
                                            subjects.push(filtered.tuesday_schedule.map(x => x.subject));
                                        }
                                        if (filtered.wednesday_schedule) {
                                            subjects.push(filtered.wednesday_schedule.map(x => x.subject));
                                        }
                                        if (filtered.thursday_schedule) {
                                            subjects.push(filtered.thursday_schedule.map(x => x.subject));
                                        }
                                        if (filtered.friday_schedule) {
                                            subjects.push(filtered.friday_schedule.map(x => x.subject));
                                        }
                                        if (filtered.saturday_schedule) {
                                            subjects.push(filtered.saturday_schedule.map(x => x.subject));
                                        }
                                        const uniqueArray = Array.from(
                                            new Map(subjects.flat().map(item => [JSON.stringify(item), item])).values()
                                        );


                                        const preffered_subject_1 = uniqueArray[0];
                                        const preffered_subject_2 = uniqueArray[1];
                                        const preffered_subjects_remaining = ((uniqueArray.length - 2) > 0) ? (uniqueArray.length - 2) : null;
                                        return (
                                            <div key={i} className="w-full h-[50px] flex justify-between items-center border-b border-baseline-outline font-manrope-semibold text-[14px] text-grey-500">
                                                <div className="w-[calc(100%-150px)]  h-full flex justify-between items-center ">
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
                                                        <p >{x.load}</p>
                                                    </div>
                                                    <div className="w-[300px] overflow-hidden flex gap-2">
                                                        {preffered_subject_1 != null && (
                                                            <div className="h-[23px] w-max px-4 bg-grey-200 rounded-full flex items-center" title={preffered_subject_1.title}>
                                                                <p className="font-manrope-medium text-[12px] text-grey-500" >{preffered_subject_1.code.toLocaleUpperCase()}</p>
                                                            </div>
                                                        )}
                                                        {preffered_subject_2 != null && (
                                                            <div className="h-[23px] w-max px-4 bg-grey-200 rounded-full flex items-center" title={preffered_subject_2.title}>
                                                                <p className="font-manrope-medium text-[12px] text-grey-500" >{preffered_subject_2.code.toLocaleUpperCase()}</p>
                                                            </div>
                                                        )}
                                                        {preffered_subjects_remaining != null && (
                                                            <div className="h-[23px] w-max px-4 bg-grey-200 rounded-full flex items-center" title={JSON.stringify(uniqueArray.slice(2).map(x => x.title))} >
                                                                <p className="font-manrope-medium text-[12px] text-grey-500" >{preffered_subjects_remaining} more...</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="mr-2">
                                                    <Button roundedFull text="View Schedule" onClick={() => ViewSchedule(filtered)} />
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
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