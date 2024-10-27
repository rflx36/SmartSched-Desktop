import { ConvertTimeToValue, ConvertValueToTime } from "../../core/utils/time_converter";
import { useScheduleStore } from "../../stores/schedule_store";
import { useSessionStore } from "../../stores/session_store";
import { useUIStore } from "../../stores/ui_store";
import { InstructorSessionSchedule, RoomSessionSchedule } from "../../types/core_types";
import { TimeType } from "../../types/types";




export default function ModalTimeTable() {
    const ui_state = useUIStore();
    const schedule = useScheduleStore();
    const session = useSessionStore();

    const show_availability = schedule.get.view_availability;
    const Close = () => {
        ui_state.get.modal = "closed";
        schedule.get.highlighted_id = "";
        ui_state.set();
    }

    const ConvertTime = (x: string) => {
        const [hours, minutes] = x.split(":");

        const hours_value = parseInt(hours);

        const ampm = hours_value >= 12 ? "PM" : "AM";

        const hours_format = hours_value % 12 || 12;
        return `${hours_format}:${minutes} ${ampm}`;
    }

    const TimeList = () => {

        const time_start_value = ConvertTimeToValue(session.get.time_start);
        const time_end_value = ConvertTimeToValue(session.get.time_end);
        const time_list = [];
        const total_hours = Math.floor((time_end_value - time_start_value) / 60);
        for (let i = 0; i <= total_hours; i++) {
            const time = Math.ceil(time_start_value / 60);
            time_list.push(ConvertTime(`${String(i + time).padStart(2, '0')}:00`));
        }
        return time_list;
    }
    const time_list = TimeList();
    let combined: Array<any> = [];
    const x = schedule.get.data;
    if (x.monday_schedule) {
        combined = [...combined, ...x.monday_schedule];
    }
    if (x.tuesday_schedule) {
        combined = [...combined, ...x.tuesday_schedule];
    }
    if (x.wednesday_schedule) {
        combined = [...combined, ...x.wednesday_schedule];
    }
    if (x.thursday_schedule) {
        combined = [...combined, ...x.thursday_schedule];
    }
    if (x.friday_schedule) {
        combined = [...combined, ...x.friday_schedule];
    }
    if (x.saturday_schedule) {
        combined = [...combined, ...x.saturday_schedule];
    }

    const filtered_sections = [... new Set(combined.map(day => day.section))];

    return (
        <div className="relative animate-fade-scale-in size-max bg-grey-100 outline outline-1 outline-neutral-600/10 rounded-[20px] z-50 px-4 py-2">
            <button
                onClick={Close}
                className="hover:bg-neutral-400/75 size-3 rounded-full p-2 absolute top-2 right-2 bg-neutral-300 grid place-content-center bg-[url('icons/icon-close.png')] bg-no-repeat bg-center bg-[length:10px_10px]" >
            </button>
            <div className="w-[970px] h-max flex flex-col items-center">

                <div className="w-full h-[45px]  flex">
                    <p className="ml-2 mb-2 font-manrope-semibold text-[20px] text-grey-900">{schedule.get.selected} Preview</p>
                    <div className="mb-2 flex-1 flex mx-2 gap-2">
                        {filtered_sections.map((x, i) => <SectionList info={x} type={i} key={i} />)}
                    </div>
                </div>
                <div className="w-full h-full overflow-hidden rounded-[15px] box-content border border-grey-300">
                    <div className="w-full h-[25px] flex border-b border-b-grey-300 text-grey-750 font-manrope-bold text-[12px]">
                        <div className="ml-[100px] border-l border-l-grey-300  w-[145px] h-full grid place-content-center">
                            <p>Monday</p>
                        </div>
                        <div className="w-[145px]  border-l border-l-grey-300 h-full grid place-content-center">
                            <p>Tuesday</p>
                        </div>
                        <div className="w-[145px]  border-l border-l-grey-300 h-full grid place-content-center">
                            <p>Wednesday</p>
                        </div>
                        <div className="w-[145px]  border-l border-l-grey-300 h-full grid place-content-center">
                            <p>Thursday</p>
                        </div>
                        <div className="w-[145px]  border-l border-l-grey-300 h-full grid place-content-center">
                            <p>Friday</p>
                        </div>
                        <div className="w-[145px]  border-l border-l-grey-300 h-full grid place-content-center">
                            <p>Saturday</p>
                        </div>
                    </div>
                    <div className="w-full max-h-[calc(100vh-200px)] flex overflow-y-scroll ">
                        <div className="w-[100px] h-max flex flex-col tabular-nums justify-center items-end">

                            {
                                time_list.map((x, i) => {
                                    return (
                                        <div className=" w-[100px] flex flex-col border-b border-b-grey-300 justify-center h-[50px] " key={i}>
                                            <p className="  mr-[25px] text-grey-750 text-right font-manrope-bold text-[14px] ">{x}</p>
                                        </div>
                                    )
                                })
                            }
                            <div className="h-[25px] w-full" />
                        </div>
                        <div className="w-[145px] border-l h-full relative border-grey-300">
                            {time_list.map((_, i) => <div className="w-full border-b border-b-grey-300 h-[50px]" key={i} />)}
                            {
                                (show_availability && schedule.get.data.availibility?.monday_schedule != undefined)
                                && <TimeAvailabilityIndicator
                                    time_start={schedule.get.data.availibility.monday_schedule.time_start}
                                    time_end={schedule.get.data.availibility.monday_schedule.time_end}
                                />
                            }
                            {schedule.get.data.monday_schedule?.map((indicator_x, indicator_i) => <TimeAllocatedIndicator availability={show_availability} key={indicator_i} id={"m" + indicator_i} info={indicator_x} type={filtered_sections.indexOf(indicator_x.section)} />)}
                        </div>
                        <div className="w-[145px] border-l h-full relative border-grey-300">
                            {time_list.map((_, i) => <div className="w-full border-b border-b-grey-300 h-[50px]" key={i} />)}
                            {
                                (show_availability && schedule.get.data.availibility?.tuesday_schedule != undefined)
                                && <TimeAvailabilityIndicator
                                    time_start={schedule.get.data.availibility.tuesday_schedule.time_start}
                                    time_end={schedule.get.data.availibility.tuesday_schedule.time_end}
                                />
                            }
                            {schedule.get.data.tuesday_schedule?.map((indicator_x, indicator_i) => <TimeAllocatedIndicator availability={show_availability} key={indicator_i} id={"t" + indicator_i} info={indicator_x} type={filtered_sections.indexOf(indicator_x.section)} />)}
                        </div>
                        <div className="w-[145px] border-l h-full relative border-grey-300">
                            {time_list.map((_, i) => <div className="w-full border-b border-b-grey-300 h-[50px]" key={i} />)}
                            {
                                (show_availability && schedule.get.data.availibility?.wednesday_schedule != undefined)
                                && <TimeAvailabilityIndicator
                                    time_start={schedule.get.data.availibility.wednesday_schedule.time_start}
                                    time_end={schedule.get.data.availibility.wednesday_schedule.time_end}
                                />
                            }
                            {schedule.get.data.wednesday_schedule?.map((indicator_x, indicator_i) => <TimeAllocatedIndicator availability={show_availability} key={indicator_i} id={"w" + indicator_i} info={indicator_x} type={filtered_sections.indexOf(indicator_x.section)} />)}
                        </div>
                        <div className="w-[145px] border-l h-full relative border-grey-300">
                            {time_list.map((_, i) => <div className="w-full border-b border-b-grey-300 h-[50px]" key={i} />)}
                            {
                                (show_availability && schedule.get.data.availibility?.thursday_schedule != undefined)
                                && <TimeAvailabilityIndicator
                                    time_start={schedule.get.data.availibility.thursday_schedule.time_start}
                                    time_end={schedule.get.data.availibility.thursday_schedule.time_end}
                                />
                            }
                            {schedule.get.data.thursday_schedule?.map((indicator_x, indicator_i) => <TimeAllocatedIndicator availability={show_availability} key={indicator_i} id={"th" + indicator_i} info={indicator_x} type={filtered_sections.indexOf(indicator_x.section)} />)}
                        </div>
                        <div className="w-[145px] border-l h-full relative border-grey-300">
                            {time_list.map((_, i) => <div className="w-full border-b border-b-grey-300 h-[50px]" key={i} />)}
                            {
                                (show_availability && schedule.get.data.availibility?.friday_schedule != undefined)
                                && <TimeAvailabilityIndicator
                                    time_start={schedule.get.data.availibility.friday_schedule.time_start}
                                    time_end={schedule.get.data.availibility.friday_schedule.time_end}
                                />
                            }
                            {schedule.get.data.friday_schedule?.map((indicator_x, indicator_i) => <TimeAllocatedIndicator availability={show_availability} key={indicator_i} id={"f" + indicator_i} info={indicator_x} type={filtered_sections.indexOf(indicator_x.section)} />)}
                        </div>
                        <div className="w-[145px] border-l h-full relative border-grey-300">
                            {time_list.map((_, i) => <div className="w-full border-b border-b-grey-300 h-[50px]" key={i} />)}
                            {
                                (show_availability && schedule.get.data.availibility?.saturday_schedule != undefined)
                                && <TimeAvailabilityIndicator
                                    time_start={schedule.get.data.availibility.saturday_schedule.time_start}
                                    time_end={schedule.get.data.availibility.saturday_schedule.time_end}
                                />
                            }
                            {schedule.get.data.saturday_schedule?.map((indicator_x, indicator_i) => <TimeAllocatedIndicator availability={show_availability} key={indicator_i} id={"s" + indicator_i} info={indicator_x} type={filtered_sections.indexOf(indicator_x.section)} />)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
function SectionList(props: { info: string, type: number }) {

    const GetStyle = () => {
        let style_bg = "bg-[#E9AA96]";
        switch (props.type) {
            case 1:
                style_bg = "bg-[#C185A2]";
                break;
            case 2:
                style_bg = "bg-[#6962AD]";
                break;
            case 3:
                style_bg = "bg-[#3B48DC]";
                break;
            case 4:
                style_bg = "bg-[#258EFF]";
                break;
            case 5:
                style_bg = "bg-[#37C9E7]";
                break;
            case 6:
                style_bg = "bg-[#45E4A6]";

        }
        return `${style_bg} size-[10px] rounded-full`;
    }
    return (
        <div className="w-max  flex items-center ">
            <div className={GetStyle()} />
            <p className="font-manrope-semibold text-grey-900 text-[14px]">{props.info}</p>
        </div>
    )
}





function TimeAllocatedIndicator(props: { info: InstructorSessionSchedule | RoomSessionSchedule, type: number, id: string, availability: boolean }) {
    const schedule = useScheduleStore();
    const time_start = props.info.time_start;
    const time_end = props.info.time_end;
    const instructor = props.info as InstructorSessionSchedule;
    const room = props.info as RoomSessionSchedule;
    const info_text = ((instructor).room == undefined) ? (room.subject.code) : (room.course.code + " " + instructor.section);
    const sub_text = ((instructor).room == undefined) ? (room.instructor?.first_name + " " + room.instructor?.last_name) : instructor.room;
    const class_session = useSessionStore();
    const session_time_start = ConvertTimeToValue(class_session.get.time_start)
    const style_time_length = ((ConvertTimeToValue(time_end)) + 1) - (ConvertTimeToValue(time_start));
    const style_length = (style_time_length / 30) * 25;
    const style_start = ((ConvertTimeToValue(time_start) - session_time_start) / 30) * 25;



    const ConvertTime = (x: TimeType, add?: number) => {
        let time = x;
        if (add != undefined) {
            const time_value = ConvertTimeToValue(x) + add;
            time = ConvertValueToTime(time_value);
        }
        const [hours, minutes] = time.split(":");

        const hours_value = parseInt(hours);
        const ampm = hours_value >= 12 ? "PM" : "AM";

        const hours_format = hours_value % 12 || 12;
        return `${hours_format}:${minutes} ${ampm}`;
    }
    const GetStyle = () => {
        let style_bg = "bg-[#E9AA96]";
        switch (props.type) {
            case 1:
                style_bg = "bg-[#C185A2]";
                break;
            case 2:
                style_bg = "bg-[#6962AD]";
                break;
            case 3:
                style_bg = "bg-[#3B48DC]";
                break;
            case 4:
                style_bg = "bg-[#258EFF]";
                break;
            case 5:
                style_bg = "bg-[#37C9E7]";
                break;
            case 6:
                style_bg = "bg-[#45E4A6]";

        }
        return `${style_bg}`;
    }
    const GetLayout = () => {
        let top_style = "top-0";
        let height_style = "h-0";

        switch (style_start) {
            case 25:
                top_style = "top-[25px]";
                break;
            case 50:
                top_style = "top-[50px]";
                break;
            case 75:
                top_style = "top-[75px]";
                break;
            case 100:
                top_style = "top-[100px]";
                break;
            case 125:
                top_style = "top-[125px]";
                break;
            case 150:
                top_style = "top-[150px]";
                break;
            case 175:
                top_style = "top-[175px]";
                break;
            case 200:
                top_style = "top-[200px]";
                break;
            case 225:
                top_style = "top-[225px]";
                break;
            case 250:
                top_style = "top-[250px]";
                break;
            case 275:
                top_style = "top-[275px]";
                break;
            case 300:
                top_style = "top-[300px]";
                break;
            case 325:
                top_style = "top-[325px]";
                break;
            case 350:
                top_style = "top-[350px]";
                break;
            case 375:
                top_style = "top-[375px]";
                break;
            case 400:
                top_style = "top-[400px]";
                break;
            case 425:
                top_style = "top-[425px]";
                break;
            case 450:
                top_style = "top-[450px]";
                break;
            case 475:
                top_style = "top-[475px]";
                break;
            case 500:
                top_style = "top-[500px]";
                break;
            case 525:
                top_style = "top-[525px]";
                break;
            case 550:
                top_style = "top-[550px]";
                break;
            case 575:
                top_style = "top-[575px]";
                break;
            case 600:
                top_style = "top-[600px]";
                break;
        }
        switch (style_length) {
            case 25:
                height_style = "h-[25px]";
                break;
            case 50:
                height_style = "h-[50px]";
                break;
            case 75:
                height_style = "h-[75px]";
                break;
            case 100:
                height_style = "h-[100px]";
                break;
            case 125:
                height_style = "h-[125px]";
                break;
            case 150:
                height_style = "h-[150px]";
                break;
            case 175:
                height_style = "h-[175px]";
                break;
            case 200:
                height_style = "h-[200px]";
                break;
            case 225:
                height_style = "h-[225px]";
                break;
            case 250:
                height_style = "h-[250px]";
                break;
            case 275:
                height_style = "h-[275px]";
                break;
            case 300:
                height_style = "h-[300px]";
                break;
            case 325:
                height_style = "h-[325px]";
                break;
            case 350:
                height_style = "h-[350px]";
                break;
            case 375:
                height_style = "h-[375px]";
                break;
            case 400:
                height_style = "h-[400px]";
                break;
            case 425:
                height_style = "h-[425px]";
                break;
            case 450:
                height_style = "h-[450px]";
                break;
            case 475:
                height_style = "h-[475px]";
                break;
            case 500:
                height_style = "h-[500px]";
                break;
            case 525:
                height_style = "h-[525px]";
                break;
            case 550:
                height_style = "h-[550px]";
                break;
            case 575:
                height_style = "h-[575px]";
                break;
            case 600:
                height_style = "h-[600px]";
                break;
        }
        const availability = (props.availability)?"":"bg-grey-100 border-b border-b-grey-300 ";
        return ` ${top_style} ${height_style} ${availability} `;
    }

    const ViewInfo = () => {
        schedule.get.highlighted_id = (schedule.get.highlighted_id == props.id) ? "" : props.id;
        schedule.set();
    }

    return (
        <div className={GetLayout() + "  absolute rounded-[3px]  w-full ease-bezier-in duration-150 flex items-center justify-center"}>
            <div className="pointer-events-none bg-grey-100 absolute w-[calc(100%-10px)] h-[calc(100%-10px)] rounded-[5px]"/>
            <div onClick={ViewInfo} className={GetStyle() + " relative hover:bg-opacity-75 cursor-pointer ease-in duration-150 text-grey-750 bg-opacity-50 w-[calc(100%-10px)] h-[calc(100%-10px)] rounded-[5px] text-center place-content-center grid"}>
                
                <p className="text-[14px] font-manrope-bold">{info_text}</p>
                <p className="text-[12px] font-manrope-medium">{sub_text}</p>
                {
                    (schedule.get.highlighted_id == props.id) ?
                        (<div className={((props.id[0] == "s") ? "-left-[190.5px]" : "-left-[90.5px]") + " cursor-default absolute w-[300px] h-[150px] rounded-[15px] top-full m-2 bg-baseline-base border border-grey-900 z-40"}>

                            <div className={((props.id[0] == "s") ? "left-[229px]" : "left-[129px]") + " pointer-events-none relative grid -top-[30px] "}>
                                <div className="z-50 mt-[1.5px] w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-baseline-base border-l-transparent border-r-transparent"></div>
                                <div className="absolute top-0 w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-grey-900 border-l-transparent border-r-transparent"></div>
                            </div>
                            <div className="pointer-events-none w-full -top-[27.5px] h-[140px] relative flex justify-between items-center">
                                <div className="w-[100px] font-manrope-bold text-[14px] text-grey-750">
                                    <p>Section:</p>
                                    <p>Subject:</p>
                                    <p>Instructor:</p>
                                    <p>Time:</p>
                                    <p>Room:</p>
                                </div>
                                <div className="w-[170px] text-left text-grey-500 text-[14px] font-manrope-semibold">
                                    <p>{props.info.course.code} {props.info.section}</p>
                                    <p>{props.info.subject.code}</p>
                                    <p>{((instructor).room != undefined) ? (schedule.get.selected) : (room.instructor?.first_name + " " + room.instructor?.last_name)}</p>
                                    <p>{ConvertTime(props.info.time_start)} - {ConvertTime(props.info.time_end, 1)}</p>
                                    <p>{((instructor).room == undefined) ? (schedule.get.selected) : instructor?.room}</p>
                                    <p></p>
                                </div>
                            </div>
                        </div>)
                        : <></>
                }
            </div>
        </div >
    )
}


function TimeAvailabilityIndicator(props: { time_start: TimeType, time_end: TimeType }) {
    const class_session = useSessionStore();
    const session_time_start = ConvertTimeToValue(class_session.get.time_start)
    const style_time_length = ((ConvertTimeToValue(props.time_end)) ) - (ConvertTimeToValue(props.time_start));
    const style_length = (style_time_length / 30) * 25;
    const style_start = ((ConvertTimeToValue(props.time_start) - session_time_start) / 30) * 25;

    const GetLayout = () => {
        let top_style = "top-0";
        let height_style = "h-0";

        switch (style_start) {
            case 25:
                top_style = "top-[25px]";
                break;
            case 50:
                top_style = "top-[50px]";
                break;
            case 75:
                top_style = "top-[75px]";
                break;
            case 100:
                top_style = "top-[100px]";
                break;
            case 125:
                top_style = "top-[125px]";
                break;
            case 150:
                top_style = "top-[150px]";
                break;
            case 175:
                top_style = "top-[175px]";
                break;
            case 200:
                top_style = "top-[200px]";
                break;
            case 225:
                top_style = "top-[225px]";
                break;
            case 250:
                top_style = "top-[250px]";
                break;
            case 275:
                top_style = "top-[275px]";
                break;
            case 300:
                top_style = "top-[300px]";
                break;
            case 325:
                top_style = "top-[325px]";
                break;
            case 350:
                top_style = "top-[350px]";
                break;
            case 375:
                top_style = "top-[375px]";
                break;
            case 400:
                top_style = "top-[400px]";
                break;
            case 425:
                top_style = "top-[425px]";
                break;
            case 450:
                top_style = "top-[450px]";
                break;
            case 475:
                top_style = "top-[475px]";
                break;
            case 500:
                top_style = "top-[500px]";
                break;
            case 525:
                top_style = "top-[525px]";
                break;
            case 550:
                top_style = "top-[550px]";
                break;
            case 575:
                top_style = "top-[575px]";
                break;
            case 600:
                top_style = "top-[600px]";
                break;
        }
        switch (style_length) {
            case 25:
                height_style = "h-[25px]";
                break;
            case 50:
                height_style = "h-[50px]";
                break;
            case 75:
                height_style = "h-[75px]";
                break;
            case 100:
                height_style = "h-[100px]";
                break;
            case 125:
                height_style = "h-[125px]";
                break;
            case 150:
                height_style = "h-[150px]";
                break;
            case 175:
                height_style = "h-[175px]";
                break;
            case 200:
                height_style = "h-[200px]";
                break;
            case 225:
                height_style = "h-[225px]";
                break;
            case 250:
                height_style = "h-[250px]";
                break;
            case 275:
                height_style = "h-[275px]";
                break;
            case 300:
                height_style = "h-[300px]";
                break;
            case 325:
                height_style = "h-[325px]";
                break;
            case 350:
                height_style = "h-[350px]";
                break;
            case 375:
                height_style = "h-[375px]";
                break;
            case 400:
                height_style = "h-[400px]";
                break;
            case 425:
                height_style = "h-[425px]";
                break;
            case 450:
                height_style = "h-[450px]";
                break;
            case 475:
                height_style = "h-[475px]";
                break;
            case 500:
                height_style = "h-[500px]";
                break;
            case 525:
                height_style = "h-[525px]";
                break;
            case 550:
                height_style = "h-[550px]";
                break;
            case 575:
                height_style = "h-[575px]";
                break;
            case 600:
                height_style = "h-[600px]";
                break;
        }
        return ` ${top_style} ${height_style} `;
    }

    return (
        <div className={GetLayout() + " absolute w-full  ease-bezier-in duration-150 flex items-center justify-center"}>
            <div className="relative h-full w-full border-b border-grey-300 bg-grey-100 [background-image:repeating-linear-gradient(60deg,_#ccc_0px,_#ccc_1px,_transparent_0,_transparent_10px)] "/>
        </div>
    )

}