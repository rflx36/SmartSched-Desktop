import { useEffect, useState } from "react";
import Baseline from "../../../components/baseline";
import Border from "../../../components/border";
import SchedulingCSP from "../../../core/csp"
import { useInstructorStore } from "../../../stores/instructor_store";
import { useSectionStore } from "../../../stores/section_store";
import { useSessionStore } from "../../../stores/session_store";
import { ICSP, IScheduleBufferType, ISchedulingResultType } from "../../../types/core_types";
import { app } from "electron";
import { TimeType } from "../../../types/types";
import { ConvertTimeToValue } from "../../../core/utils/time_converter";
import '../../../custom.css';
import { GetPrecedingDay } from "../../../core/utils/time_modifier";


export default function SetupStep_4() {
    const class_session = useSessionStore();
    const class_section = useSectionStore();
    const class_instructors = useInstructorStore();

    const [filter, setFilter] = useState(1);
    const [data, setData] = useState<ISchedulingResultType | null>(null);

    useEffect(() => {

        const Compute = async () => {

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
            const csp = new SchedulingCSP(inputs);

            const solved_data = await csp.Solve();
            if (solved_data) {
                setData(solved_data);
            }
            else {
                //retry
            }
        }
        Compute();

    }, [])
    // app.commandLine
    // app.commandLine.appendSwitch('js-flags', '--expose_gc --max-old-space-size=128');

    return (
        <div className="flex mt-4">
            <Border>
                <Baseline>
                    <div className="w-80 min-h-[475px] h-[calc(100vh-220px)]">

                    </div>
                </Baseline>
            </Border>
            <Border>
                <div className="flex min-w-[650px] w-[calc(100vw-700px)] min-h-[475px] h-[calc(100vh-220px)] relative overflow-y-scroll">
                    <div className="w-full h-full absolute">
                        <Baseline widthFull>
                            <div className="h-14 w-full grid place-content-center">
                                <div className="w-full rounded-full font-manrope-semibold text-[14px] h-max p-1 bg-baseline-border-base flex gap-1">
                                    <FilterButton text="Rooms" onClick={() => { setFilter(1) }} is_selected={filter == 1} />
                                    <FilterButton text="Instructors" onClick={() => { setFilter(2) }} is_selected={filter == 2} />
                                    <FilterButton text="1st year" onClick={() => { setFilter(3) }} is_selected={filter == 3} />
                                    <FilterButton text="2nd year" onClick={() => { setFilter(4) }} is_selected={filter == 4} />
                                    <FilterButton text="3rd year" onClick={() => { setFilter(5) }} is_selected={filter == 5} />
                                    <FilterButton text="4th year" onClick={() => { setFilter(6) }} is_selected={filter == 6} />
                                </div>


                            </div>
                        </Baseline>
                    </div>
                    {data != null && <ScheduleContainer filter={filter} data={data} />}

                </div>
            </Border>
        </div>
    )
}

function ScheduleContainer(props: { filter: number, data: ISchedulingResultType }) {
    const SetFilter = () => {
        console.log(props.data.result);
        const result = props.data.result;
        let filtered_result = [];
        if (props.filter == 1) {
            const rooms = result.map(x => x.room).filter((x, i, s) => s.indexOf(x) === i);
            for (let i = 0; i < rooms.length; i++) {
                const room_index_filter = result.filter(x => x.room == rooms[i]);
                const subsequents = room_index_filter.filter(x=> x.subject.is_dividable).map(x=>{
                    const subsequent_day = GetPrecedingDay(x.day,3);
                    return {...x,day:subsequent_day}
                });
                filtered_result.push([...room_index_filter,...subsequents]);
            }
        }
        return filtered_result;
    }
    const filtered_data = SetFilter();
    console.log(props.data.result);
    console.log(filtered_data);
    
    return (
        <div className="mt-20   inline-block ">
            {filtered_data.map((x, i) => {
                const monday_indicator = x.filter(indicator_x => indicator_x.day == "monday");
                const tuesday_indicator = x.filter(indicator_x => indicator_x.day == "tuesday");
                const wednesday_indicator = x.filter(indicator_x => indicator_x.day == "wednesday");
                const thursday_indicator = x.filter(indicator_x => indicator_x.day == "thursday");
                const friday_indicator = x.filter(indicator_x => indicator_x.day == "friday");
                const saturday_indicator = x.filter(indicator_x => indicator_x.day == "saturday");
                const sections_filtered = x.map(indicator_x => indicator_x.section).filter((x, i, s) => s.indexOf(x) === i)
                return (
                    <div key={i} className="cursor-pointer mx-1 schedule-container relative w-[152px] h-[152px] rounded-[4px] border inline-block border-grey-300 bg-grey-100">
                        <div className="w-full h-full flex flex-col items-center">
                            <div className="w-[115px] h-[120px] mt-2  overflow-hidden flex gap-[5px] ">
                                <div className="schedule-container relative w-[15px] h-full ">
                                    {monday_indicator.map((indicator_x, indicator_i) => <TimeAllocatedIndicator key={indicator_i} time_start={indicator_x.time_start} time_end={indicator_x.time_end} type={sections_filtered.indexOf(indicator_x.section)} />)}
                                </div>
                                <div className="relative w-[15px] h-full">
                                    {tuesday_indicator.map((indicator_x, indicator_i) => <TimeAllocatedIndicator key={indicator_i} time_start={indicator_x.time_start} time_end={indicator_x.time_end} type={sections_filtered.indexOf(indicator_x.section)} />)}
                                </div>
                                <div className="relative w-[15px] h-full">
                                    {wednesday_indicator.map((indicator_x, indicator_i) => <TimeAllocatedIndicator key={indicator_i} time_start={indicator_x.time_start} time_end={indicator_x.time_end} type={sections_filtered.indexOf(indicator_x.section)} />)}
                                </div>
                                <div className="relative w-[15px] h-full">
                                    {thursday_indicator.map((indicator_x, indicator_i) => <TimeAllocatedIndicator key={indicator_i} time_start={indicator_x.time_start} time_end={indicator_x.time_end} type={sections_filtered.indexOf(indicator_x.section)} />)}
                                </div>
                                <div className="relative w-[15px] h-full">
                                    {friday_indicator.map((indicator_x, indicator_i) => <TimeAllocatedIndicator key={indicator_i} time_start={indicator_x.time_start} time_end={indicator_x.time_end} type={sections_filtered.indexOf(indicator_x.section)} />)}
                                </div>
                                <div className="relative w-[15px] h-full">
                                    {saturday_indicator.map((indicator_x, indicator_i) => <TimeAllocatedIndicator key={indicator_i} time_start={indicator_x.time_start} time_end={indicator_x.time_end} type={sections_filtered.indexOf(indicator_x.section)} />)}
                                </div>
                            </div>
                            <p>{props.data.rooms[x[0].room]}  </p>
                        </div>

                    </div>
                )
            })
            }

        </div>
    )

}

function TimeAllocatedIndicator(props: { time_start: TimeType, time_end: TimeType, type: number }) {
    const class_session = useSessionStore();
    const session_time_start = ConvertTimeToValue(class_session.get.time_start)
    const style_time_length = ((ConvertTimeToValue(props.time_end)) + 1) - (ConvertTimeToValue(props.time_start));
    const style_length = (style_time_length / 30) * 5;
    const style_start = ((ConvertTimeToValue(props.time_start) - session_time_start) / 30) * 5;

    const GetStyle = () => {
        let top_style = "top-0";
        let height_style = "h-0";
        let style_bg = "bg-grey-200";
        let id = "type-a";
        switch (props.type) {
            case 1:
                style_bg = "bg-grey-300";
                id = "type-b";
                break;
            case 2:
                style_bg = "bg-grey-400";
                id = "type-c";
                break;
            case 3:
                style_bg = "bg-grey-500";
                id = "type-d";
                break;
            case 4:
                style_bg = "bg-grey-600";
                id = "type-e";
                break;
            case 5:
                style_bg = "bg-grey-700";
                id = "type-f";
                break;
            case 6:
                style_bg = "bg-grey-900";
                id = "type-g";
                break;

        }
        switch (style_start) {
            case 5:
                top_style = "top-[5px]";
                break;
            case 10:
                top_style = "top-[10px]";
                break;
            case 15:
                top_style = "top-[15px]";
                break;
            case 20:
                top_style = "top-[20px]";
                break;
            case 25:
                top_style = "top-[25px]";
                break;
            case 30:
                top_style = "top-[30px]";
                break;
            case 35:
                top_style = "top-[35px]";
                break;
            case 40:
                top_style = "top-[40px]";
                break;
            case 45:
                top_style = "top-[45px]";
                break;
            case 50:
                top_style = "top-[50px]";
                break;
            case 55:
                top_style = "top-[55px]";
                break;
            case 60:
                top_style = "top-[60px]";
                break;
            case 65:
                top_style = "top-[65px]";
                break;
            case 70:
                top_style = "top-[70px]";
                break;
            case 75:
                top_style = "top-[75px]";
                break;
            case 80:
                top_style = "top-[80px]";
                break;
            case 85:
                top_style = "top-[85px]";
                break;
            case 90:
                top_style = "top-[90px]";
                break;
            case 95:
                top_style = "top-[95px]";
                break;
            case 100:
                top_style = "top-[100px]";
                break;
            case 105:
                top_style = "top-[105px]";
                break;
            case 110:
                top_style = "top-[110px]";
                break;
            case 115:
                top_style = "top-[115px]";
                break;
            case 120:
                top_style = "top-[120px]";
                break;
        }
        switch (style_length) {
            case 5:
                height_style = "h-[5px]";
                break;
            case 10:
                height_style = "h-[10px]";
                break;
            case 15:
                height_style = "h-[15px]";
                break;
            case 20:
                height_style = "h-[20px]";
                break;
            case 25:
                height_style = "h-[25px]";
                break;
            case 30:
                height_style = "h-[30px]";
                break;
            case 35:
                height_style = "h-[35px]";
                break;
            case 40:
                height_style = "h-[40px]";
                break;
            case 45:
                height_style = "h-[45px]";
                break;
            case 50:
                height_style = "h-[50px]";
                break;
            case 55:
                height_style = "h-[55px]";
                break;
            case 60:
                height_style = "h-[60px]";
                break;
            case 65:
                height_style = "h-[65px]";
                break;
            case 70:
                height_style = "h-[70px]";
                break;
            case 75:
                height_style = "h-[75px]";
                break;
            case 80:
                height_style = "h-[80px]";
                break;
            case 85:
                height_style = "h-[85px]";
                break;
            case 90:
                height_style = "h-[90px]";
                break;
            case 95:
                height_style = "h-[95px]";
                break;
            case 100:
                height_style = "h-[100px]";
                break;
            case 105:
                height_style = "h-[105px]";
                break;
            case 110:
                height_style = "h-[110px]";
                break;
            case 115:
                height_style = "h-[115px]";
                break;
            case 120:
                height_style = "h-[120px]";
                break;
        }
        return `${id} ${top_style} ${height_style} ${style_bg} `;
    }

    return (
        <div className={GetStyle() + " absolute rounded-[3px]  w-full ease-bezier-in duration-150 "}>
        </div>
    )
}

function FilterButton(props: { text: string, onClick: () => void, is_selected: boolean }) {

    if (props.is_selected) {
        return (
            <button className="grid place-content-center border border-baseline-outline bg-baseline-base rounded-full h-8 w-[100px]">
                <p className="text-grey-600">{props.text}</p>

            </button>
        )
    }
    else {
        return (
            <button onClick={props.onClick} className="grid place-content-center w-[100px] h-8 duration-75 ease-in text-grey-400 hover:text-grey-600 hover:bg-grey-300/40 rounded-full">
                <p className="">{props.text}</p>
            </button>
        )
    }
}