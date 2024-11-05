import { useEffect, useState } from "react";
import Baseline from "../../../components/baseline";
import Border from "../../../components/border";
import SchedulingCSP from "../../../core/csp"
import { useInstructorStore } from "../../../stores/instructor_store";
import { useSectionStore } from "../../../stores/section_store";
import { useSessionStore } from "../../../stores/session_store";
import { DataFiltered, ICSP, ISchedulingResultType } from "../../../types/core_types";
import { RoomType, ScheduleFilterType, TimeType } from "../../../types/types";
import { ConvertTimeToValue } from "../../../core/utils/time_converter";
import '../../../custom.css';
import { useUIStore } from "../../../stores/ui_store";
import { useScheduleStore } from "../../../stores/schedule_store";
import FilterResult from "../../../core/utils/filter_result";
import Input from "../../../components/input";
import { numberToSeed, shuffleArrayWithSeed } from "../../../core/utils/seed";


export default function SetupStep_4() {
    const ui_state = useUIStore();
    const class_session = useSessionStore();
    const class_section = useSectionStore();
    const class_instructors = useInstructorStore();
    const [filter, setFilter] = useState(1);
    const [data, setData] = useState<ISchedulingResultType | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [seed, setSeed] = useState("");
    const [regenerateCounter, setRegenerateCounter] = useState(-1);
    const limit = 100;
    const Compute = async (inputs: ICSP, attempts: number) => {

        const deep_copy = structuredClone(inputs);
        const csp = new SchedulingCSP(deep_copy);
        // const prototype = new SchedulingCSPAlternating(inputs);
        // await prototype.Solve();
        const solved_data = await csp.Solve();
        if (solved_data) {
            setData(solved_data);
            setIsGenerating(false);
        }
        else {
            setTimeout(() => {

                Regenerate(attempts);
            }, 5)
        }
    }
    useEffect(() => {
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
        setIsGenerating(true);
        Compute(inputs, 0);
    }, [])

    const Upload = () => {
        ui_state.get.modal = "upload auth";


        const input = {
            semester: class_section.get.sem_active,
            rooms: class_session.get.rooms,
            courses: class_session.get.courses,
            data: data!.result,
            instructors: data!.instructors,
            inputs: class_section.get.data,
            time_start: class_session.get.time_start,
            time_end: class_session.get.time_end,
            break_time_start: class_session.get.break_time_start,
            break_time_end: class_session.get.break_time_end,
        }
        ui_state.get.modal_upload_auth = input;
        ui_state.set();
    }

    const Regenerate = (counter: number) => {
        // if (data == null) {
        //     return;
        // }
        if (counter <= limit) {
            setRegenerateCounter(counter);
        }
        else {
            return;
        }
        const randomized = numberToSeed(Math.floor(Math.random() * (0x80000000) - 1));
        setSeed(randomized);
        const current_seed = randomized;

        const inputs: ICSP = {
            time_start: class_session.get.time_start,
            time_end: class_session.get.time_end,
            break_time_start: class_session.get.break_time_start,
            break_time_end: class_session.get.break_time_end,
            instructors: shuffleArrayWithSeed(class_instructors.get.instructors, current_seed),
            courses: class_session.get.courses,
            rooms: shuffleArrayWithSeed(class_session.get.rooms.filter(x => !x.is_realtime).map(x => x.room_name), current_seed),
            rooms_lab: class_session.get.rooms.filter(x => x.is_realtime).map(x => x.room_name),
            data: class_section.get.data.map(x => ({ ...x, subjects: shuffleArrayWithSeed(x.subjects, current_seed) }))
        }
        Compute(inputs, counter + 1);

    }
    const SeedTriggerRegenerate = (x: string) => {
        if (isGenerating) {
            return;
        }
        setSeed(x)
        if (x.length < 4) {
            return;
        }

        setIsGenerating(true);
        const current_seed = x;
        const inputs: ICSP = {
            time_start: class_session.get.time_start,
            time_end: class_session.get.time_end,
            break_time_start: class_session.get.break_time_start,
            break_time_end: class_session.get.break_time_end,
            instructors: shuffleArrayWithSeed(class_instructors.get.instructors, current_seed),
            courses: class_session.get.courses,
            rooms: shuffleArrayWithSeed(class_session.get.rooms.filter(x => !x.is_realtime).map(x => x.room_name), current_seed),
            rooms_lab: class_session.get.rooms.filter(x => x.is_realtime).map(x => x.room_name),
            data: class_section.get.data.map(x => ({ ...x, subjects: shuffleArrayWithSeed(x.subjects, current_seed) }))
        }
        Compute(inputs, 1);
    }

    const TriggerRegenerate = () => {
        if (isGenerating) {
            return;
        }
        setIsGenerating(true);
        Regenerate(0);

    }

    return (
        <div className="flex mt-4">
            <Border>
                <Baseline>
                    <div className="w-80 min-h-[475px] flex flex-col justify-between h-[calc(100vh-220px)]">
                        <div className="w-full flex flex-col items-center h-max gap-6">
                            <div className="w-max mt-8">
                                <Input maxLength={4} upperCase type="text" value={seed} onChange={(x) => SeedTriggerRegenerate(x)} label="Seed" textCenter />
                            </div>
                            <button onClick={TriggerRegenerate} className={((isGenerating) ? " cursor-default" : "") + " w-52 h-12  border-4 border-grey-200 rounded-[10px] grid place-content-center"} >
                                <div className=" w-[200px] grid place-content-center rounded-md bg-[linear-gradient(90deg,rgba(233,170,150,0.5)_0%,rgba(193,133,162,0.5)_48%,rgba(105,98,173,0.5)_100%)]  h-10">
                                    {
                                        (isGenerating) ?
                                            <div className="w-[196px] rounded-[4px] h-9 grid place-content-center bg-baseline-base bg-opacity-35 ease-bezier-in duration-100">
                                                <img src="images/loader.png" className="animate-spin" />
                                            </div>
                                            :
                                            <div className="w-[196px] rounded-[4px] h-9 grid place-content-center bg-baseline-base hover:bg-opacity-75 ease-bezier-in duration-100">
                                                <p className="bg-gradient-to-r from-[#e9aa96] via-[#c185a2] to-[#6962ad] text-[16px] font-manrope-bold bg-clip-text text-transparent">Re-Generate</p>
                                            </div>
                                    }
                                </div>
                            </button>
                            {
                            }
                            <div className="font-manrope-semibold ">
                                {(!isGenerating) ?
                                    <p className="text-green-600">Generated Successfully</p>
                                    :
                                    <p className="text-grey-500">Attempts:{regenerateCounter}</p>

                                }
                                {
                                    (isGenerating && regenerateCounter >= limit) &&
                                    <p className="text-red-500">Solution Not Possible</p>


                                }

                            </div>

                        </div>
                        <div className="w-full h-max mb-[65px] flex flex-col gap-6 items-center">

                            <div className="w-max h-max grid place-content-center p-1 bg-grey-200 rounded-lg">
                                <button onClick={Upload} className="w-[200px] h-[40px]    hover:bg-grey-750/90  bg-grey-750 border border-grey-900 rounded-md">
                                    <p className="text-[16px] font-manrope-semibold text-grey-100">Upload</p>
                                </button>
                            </div>
                            <div className="w-max h-max grid place-content-center p-1 bg-grey-200 rounded-lg">
                                <button className="w-[200px] h-[40px] text-grey-500 hover:text-grey-750  hover:border-grey-400/80  bg-baseline-base border border-grey-300 rounded-md">
                                    <p className="text-[16px] font-manrope-semibold">Export as CSV</p>
                                </button>
                            </div>
                        </div>
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

                    {(data == null) ?
                        (
                            <>
                                <div className="w-full h-full grid place-content-center">

                                    <img src="images/loader.png" className="animate-spin w-40" />

                                </div>
                            </>
                        )
                        :
                        (
                            <div className={isGenerating ? "opacity-75 pointer-events-none" : ""} >
                                <ScheduleContainer filter={filter} data={data} rooms={class_session.get.rooms} />
                            </div>
                        )
                    }

                </div>
            </Border>
        </div>
    )
}

function ScheduleContainer(props: { filter: number, data: ISchedulingResultType, rooms: Array<RoomType> }) {
    const ui_state = useUIStore();
    const schedule = useScheduleStore();
    const filtered_data = FilterResult(props.filter, props.data.result, props.rooms.map(x => x.room_name));
    console.log(filtered_data);
    const ViewSchedule = (x: DataFiltered) => {

        schedule.get.selected = x.filter;
        schedule.get.data = x;
        schedule.get.filter_type = GetFilterType();
        schedule.get.view_availability = (props.filter == 2);
        schedule.set();
        ui_state.get.modal = "schedule";
        ui_state.set();
    }
    const GetFilterType = (): ScheduleFilterType => {
        switch (props.filter) {
            case 1:
                return "room";
            case 2:
                return "instructor";
            case 3:
                return "section";
            default:
                return "room";
        }
    }

    return (
        <div className="mt-20   inline-block ">
            {
                filtered_data.map((x, i) => {
                    let combined: Array<any> = [];

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

                    const filtered_sections = [... new Set(combined.map(day => (props.filter > 2) ? (day.subject.code) : (day.section)))];

                    return (
                        <div key={i} onClick={() => ViewSchedule(x)} className="cursor-pointer m-1 schedule-container relative w-[152px] h-[152px] rounded-[4px] border inline-block border-grey-300 bg-grey-100">
                            <div className="w-full h-full flex flex-col items-center">
                                <div className="w-[115px] h-[120px] mt-2  overflow-hidden flex gap-[5px] ">
                                    <div className="relative w-[15px] h-full ">
                                        {x.monday_schedule?.map((indicator_x, indicator_i) => <TimeAllocatedIndicator key={indicator_i} time_start={indicator_x.time_start} time_end={indicator_x.time_end} type={filtered_sections.indexOf((props.filter > 2) ? indicator_x.subject.code : indicator_x.section)} />)}
                                    </div>
                                    <div className="relative w-[15px] h-full ">
                                        {x.tuesday_schedule?.map((indicator_x, indicator_i) => <TimeAllocatedIndicator key={indicator_i} time_start={indicator_x.time_start} time_end={indicator_x.time_end} type={filtered_sections.indexOf((props.filter > 2) ? indicator_x.subject.code : indicator_x.section)} />)}
                                    </div>
                                    <div className="relative w-[15px] h-full ">
                                        {x.wednesday_schedule?.map((indicator_x, indicator_i) => <TimeAllocatedIndicator key={indicator_i} time_start={indicator_x.time_start} time_end={indicator_x.time_end} type={filtered_sections.indexOf((props.filter > 2) ? indicator_x.subject.code : indicator_x.section)} />)}
                                    </div>
                                    <div className="relative w-[15px] h-full ">
                                        {x.thursday_schedule?.map((indicator_x, indicator_i) => <TimeAllocatedIndicator key={indicator_i} time_start={indicator_x.time_start} time_end={indicator_x.time_end} type={filtered_sections.indexOf((props.filter > 2) ? indicator_x.subject.code : indicator_x.section)} />)}
                                    </div>
                                    <div className="relative w-[15px] h-full ">
                                        {x.friday_schedule?.map((indicator_x, indicator_i) => <TimeAllocatedIndicator key={indicator_i} time_start={indicator_x.time_start} time_end={indicator_x.time_end} type={filtered_sections.indexOf((props.filter > 2) ? indicator_x.subject.code : indicator_x.section)} />)}
                                    </div>
                                    <div className="relative w-[15px] h-full ">
                                        {x.saturday_schedule?.map((indicator_x, indicator_i) => <TimeAllocatedIndicator key={indicator_i} time_start={indicator_x.time_start} time_end={indicator_x.time_end} type={filtered_sections.indexOf((props.filter > 2) ? indicator_x.subject.code : indicator_x.section)} />)}
                                    </div>
                                </div>
                                <p className="font-manrope-bold text-[12px]">{x.filter}  </p>

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