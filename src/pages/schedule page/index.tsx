import { useState } from "react";
import Baseline from "../../components/baseline";
import Border from "../../components/border";
import { useMainScheduleStore } from "../../stores/main_schedule_store";
import FilterResult from "../../core/utils/filter_result";
import { DataFiltered } from "../../types/core_types";
import { useUIStore } from "../../stores/ui_store";
import { useScheduleStore } from "../../stores/schedule_store";
import { ScheduleFilterType, TimeType } from "../../types/types";
import { ConvertTimeToValue } from "../../core/utils/time_converter";




export default function PageSchedule() {
    const main = useMainScheduleStore();
    const [searchValue, setSearchValue] = useState("");

    const [filterType, setFilterType] = useState<"Instructor" | "Room" | "1st Year" | "2nd Year" | "3rd Year" | "4th Year">("Room");
    const filterlist = ["Room", "Instructor", "1st Year", "2nd Year", "3rd Year", "4th Year"];

    const Search = () => {

    }


    const SearchFiltered = () => {
        if (searchValue == "") {
            return GetData();
        }

        return GetData().filter(item => item.filter.toLowerCase().includes(searchValue.toLowerCase()));

    }

    const GetData = () => {
        if (!main.get) {
            return [];
        }
        const data = main.get.data;
        const rooms = main.get.rooms.map(x => x.room_name);
        switch (filterType) {
            case "Room":
                return FilterResult(1, data, rooms);
            case "Instructor":
                return FilterResult(2, data, rooms);
            case "1st Year":
                return FilterResult(3, data, rooms);
            case "2nd Year":
                return FilterResult(4, data, rooms);
            case "3rd Year":
                return FilterResult(5, data, rooms);
            case "4th Year":
                return FilterResult(6, data, rooms);

        }
    }

    const data = SearchFiltered();

    return (
        <div className="w-full flex justify-center">

            <div className=" mt-12">
                <p className="ml-1 font-manrope-semibold text-grey-900 text-[20px]">Current Schedules in {main.get?.semester} Sem</p>

                <Border>
                    <div className="w-input-full min-w-[1008px] flex flex-col min-h-[525px] h-[calc(100vh-200px)] relative z-10 ">
                        <div className="z-[5]">

                            <Baseline widthFull>
                                <div className="flex h-full w-full">
                                    <div className="w-max h-[40px] flex items-center bg-baseline-border-base rounded-full my-1 mx-2 ">
                                        <button onClick={Search} className=" w-[40px] ml-2 bg-no-repeat bg-center h-[40px] hover:bg-[url('icons/icon-search-hovered.png')]  bg-[url('icons/icon-search.png')]" />
                                        <input className="h-full focus:text-grey-750  pl-2 w-[350px] bg-transparent font-manrope-medium text-grey-400 outline-none " placeholder="Search" type="text" value={searchValue} onChange={x => setSearchValue(x.target.value)} />
                                        <div className="w-[1px] h-[28px] bg-grey-300 rounded-full" />
                                        <FilterDropdown items={filterlist} selection={x => setFilterType(x)} />
                                    </div>
                                </div>
                            </Baseline>
                        </div>
                        <div className="h-auto flex-1 overflow-y-scroll ">
                            <ScheduleContainer data={data} filter={filterType} time_start={main.get?.time_start || "00:00"} time_end={main.get?.time_end || "00:00"} />
                        </div>
                    </div>
                </Border>
            </div>
        </div>
    )
}


function FilterDropdown(props: { items: Array<string>, selection: (x: any) => void }) {
    const [selected, setSelected] = useState<string | null>(null);
    const [isActive, setIsActive] = useState(false);

    if (selected == null) {
        setSelected(props.items[0]);
    }
    const SetSelecion = (item: string) => {
        props.selection(item);
        setSelected(item);
        setIsActive(false);
    }


    return (
        <div className={((isActive) ? " bg-grey-200 text-grey-600" : " text-grey-400") + " rounded-r-full w-max h-full flex flex-col justify-center relative z-50 cursor-pointer "} >
            <div onClick={() => setIsActive(!isActive)} className="w-[150px] flex justify-between h-full items-center">
                <p className="ml-2  font-manrope-semibold text-[16px]">{selected}</p>
                <img src="icons/icon-arrow.png" className={((isActive) ? "rotate-180" : "") + " mr-2 opacity-75 hover:opacity-90"} />
            </div>
            {
                (isActive) ?
                    (
                        <div className="absolute top-[40px] mt-1 w-full bg-grey-100 border border-baseline-outline rounded-[10px] overflow-hidden ">
                            {props.items.map((x, i) => {
                                return (
                                    <div onClick={() => SetSelecion(x)} key={i} className="h-full p-2 hover:bg-grey-200   hover:text-grey-750 text-grey-400 font-manrope-semibold">
                                        <p>{x}</p>
                                    </div>
                                )
                            })}
                        </div>
                    ) :
                    <>
                    </>
            }

        </div>

    )

}



function ScheduleContainer(props: { data: Array<DataFiltered>, filter: string, time_start: TimeType, time_end: TimeType }) {
    const filter_case = (props.filter == "1st Year" || props.filter == "2nd Year" || props.filter == "3rd Year" || props.filter == "4th Year");
    const ui_state = useUIStore();
    const schedule = useScheduleStore();
    const ViewSchedule = (x: DataFiltered) => {

        schedule.get.selected = x.filter;
        schedule.get.data = x;
        schedule.get.filter_type = GetFilterType();
        schedule.get.view_availability = (props.filter == "Instructor");
        schedule.get.time_start = props.time_start;
        schedule.get.time_end = props.time_end;
        schedule.set();
        ui_state.get.modal = "schedule";
        ui_state.set();
    }
    const GetFilterType = (): ScheduleFilterType => {
        switch (props.filter) {
            case "Room":
                return "room";
            case "Instructor":
                return "instructor";
            default:
                return "section";
        }
    }

    return (
        <div className="mt-1   inline-block ">
            {
                props.data.map((x, i) => {
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

                    const filtered_sections = [... new Set(combined.map(day => (filter_case) ? (day.subject.code) : (day.section)))];

                    return (
                        <div key={i} onClick={() => ViewSchedule(x)} className="cursor-pointer m-1 schedule-container relative w-[152px] h-[152px] rounded-[4px] border inline-block border-grey-300 bg-grey-100">
                            <div className="w-full h-full flex flex-col items-center">
                                <div className="w-[115px] h-[120px] mt-2  overflow-hidden flex gap-[5px] ">
                                    <div className="relative w-[15px] h-full ">
                                        {x.monday_schedule?.map((indicator_x, indicator_i) => <TimeAllocatedIndicator key={indicator_i} time_start={indicator_x.time_start} time_end={indicator_x.time_end} type={filtered_sections.indexOf((filter_case) ? indicator_x.subject.code : indicator_x.section)} />)}
                                    </div>
                                    <div className="relative w-[15px] h-full ">
                                        {x.tuesday_schedule?.map((indicator_x, indicator_i) => <TimeAllocatedIndicator key={indicator_i} time_start={indicator_x.time_start} time_end={indicator_x.time_end} type={filtered_sections.indexOf((filter_case) ? indicator_x.subject.code : indicator_x.section)} />)}
                                    </div>
                                    <div className="relative w-[15px] h-full ">
                                        {x.wednesday_schedule?.map((indicator_x, indicator_i) => <TimeAllocatedIndicator key={indicator_i} time_start={indicator_x.time_start} time_end={indicator_x.time_end} type={filtered_sections.indexOf((filter_case) ? indicator_x.subject.code : indicator_x.section)} />)}
                                    </div>
                                    <div className="relative w-[15px] h-full ">
                                        {x.thursday_schedule?.map((indicator_x, indicator_i) => <TimeAllocatedIndicator key={indicator_i} time_start={indicator_x.time_start} time_end={indicator_x.time_end} type={filtered_sections.indexOf((filter_case) ? indicator_x.subject.code : indicator_x.section)} />)}
                                    </div>
                                    <div className="relative w-[15px] h-full ">
                                        {x.friday_schedule?.map((indicator_x, indicator_i) => <TimeAllocatedIndicator key={indicator_i} time_start={indicator_x.time_start} time_end={indicator_x.time_end} type={filtered_sections.indexOf((filter_case) ? indicator_x.subject.code : indicator_x.section)} />)}
                                    </div>
                                    <div className="relative w-[15px] h-full ">
                                        {x.saturday_schedule?.map((indicator_x, indicator_i) => <TimeAllocatedIndicator key={indicator_i} time_start={indicator_x.time_start} time_end={indicator_x.time_end} type={filtered_sections.indexOf((filter_case) ? indicator_x.subject.code : indicator_x.section)} />)}
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
    // const class_session = useSessionStore();
    const main = useMainScheduleStore();

    const session_time_start = ConvertTimeToValue((main.get?.time_start || "00:00"))
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