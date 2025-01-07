import { useEffect, useState } from "react";
import Button from "../../components/button";
import { useMainScheduleStore } from "../../stores/main_schedule_store"
import { useUIStore } from "../../stores/ui_store";
import { AcceptDBTypes, AllocatedListType, FloorType, RequestDBTypes, RequestTypes, TimeType, ViewListedScheduleType, YearType } from "../../types/types";
import { onValue, ref, remove } from "firebase/database";
import { realtime_database } from "../../firebase/firebase_config";
import Baseline from "../../components/baseline";
import { ConvertTimeToValue, ConvertValueToTime, RevertTime } from "../../core/utils/time_converter";
import FilterResult from "../../core/utils/filter_result";
import { RoomSessionSchedule } from "../../types/core_types";






export default function PageDashboard() {
    const main = useMainScheduleStore();
    const ui_state = useUIStore();

    if (main.get == null) {
        // ui_state.get.sidebar_active = "schedules";
        // ui_state.set();
        return (
            <div className="flex justify-center items-center">
                <p className="font-manrope-semibold text-grey-600">No Assigned Main Schedule Yet</p>
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
        <div className="w-full justify-center ">

            <div className="w-max  mx-auto mt-5">
                <div className="flex">



                    <div className=" mr-2 ">

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
                        <RoomRequestContainer />
                    </div>
                    <div className="flex p-1 w-max h-max border shadow-inner border-baseline-border-outline bg-baseline-border-base rounded-lg">
                        <div className="min-h-[500px] w-full max-h-[calc(100vh-90px)]">
                            <RoomsContainer />

                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}


const getTodayDate = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = String(today.getFullYear()).slice(-2);
    return `${month}-${day}-${year}`;
};

function RoomRequestContainer() {
    const [requests, setRequests] = useState<Array<RequestDBTypes>>([]);



    const removeInvalidRequest = async (id: Array<string>) => {
        for (let i = 0; i < id.length; i++) {
            const invalidRef = ref(realtime_database, `schedule/request/${id[i]}`);
            await remove(invalidRef);
        }
    }
    useEffect(() => {
        const ref_ = ref(realtime_database, "schedule/request");
        onValue(ref_, (snapshot) => {

            if (!snapshot.exists()) {
                setRequests([]);
                return;
            }
            const data = snapshot.val();
            const requestsWithId: RequestDBTypes[] = Object.entries(data).map(([id, value]) => ({
                ...(value as Omit<RequestDBTypes, "id">),
                id,
            }));

            const filteredRequest: RequestDBTypes[] = requestsWithId.filter(x => x.day_validity == getTodayDate());
            const invalidRequest: RequestDBTypes[] = requestsWithId.filter(x => x.day_validity != getTodayDate());
            setRequests(filteredRequest);

            if (invalidRequest.length > 0) {
                removeInvalidRequest(invalidRequest.map(x => x.id));
            }
        })
    }, [])
    const request_sorted = requests.sort((a, b) => ConvertTimeToValue(a.time_requested) - ConvertTimeToValue(b.time_requested));
    return (
        <>
            <p className="font-manrope-bold text-[20px] text-grey-950 ml-4 mb-1">Room Request</p>
            <div className="flex flex-col p-1 w-full min-h-[447px] h-[calc(100vh-350px)]  overflow-y-scroll border  shadow-inner border-baseline-border-outline bg-baseline-border-base rounded-lg " >
                <div className="w-full  flex flex-col-reverse ">
                    {/* 
                    {x.map((x, i) => {

                        const request_info:RequestTypes = {

                        }

                        return <RoomRequestCard 
                        // return <RoomRequestCard room={x.room} time_start={x.time_start} time_end={x.time_end} section={x.section} name={x.instructor} />
                    })} */}
                    {
                        request_sorted.map((x, i) => {

                            const request: RequestTypes = {
                                message: x.message,
                                name: x.name,
                                room: x.room_name,
                                section: x.section,
                                time_start: x.time_start,
                                time_end: x.time_end,
                                uid: x.uid,
                                time_requested: x.time_requested,
                                id: x.id
                            }
                            return <RoomRequestCard key={i} info={request} />
                        })
                    }
                </div>

            </div>
        </>
    )

}


function RoomRequestCard(props: { info: RequestTypes }) {
    const ui_state = useUIStore();


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
    const ViewRequest = () => {
        ui_state.get.modal = "request";
        ui_state.get.modal_request = {
            room: props.info.room,
            name: props.info.name,
            message: props.info.message,
            section: props.info.section,
            time_start: props.info.time_start,
            time_end: props.info.time_end,
            uid: props.info.uid,
            time_requested: props.info.time_requested,
            id: props.info.id
        }
        ui_state.set();
    }
    return (
        <div className="flex animate-fade-scale-in duration-150 ease-in justify-between px-2 m-1 mb-2 items-center bg-grey-100 border border-grey-300  rounded-[4px] h-[90px] min-w-[350px]">


            <div className="flex flex-col  h-[calc(100%-28px)] justify-between w-full ml-2 mr-3 pointer-events-none">
                <div className="text-[14px] font-manrope-semibold text-grey-500 flex  w-full ">
                    <p className="flex-1">{props.info.room}</p>
                    <p className="flex-1">{props.info.time_start} - {props.info.time_end} </p>
                </div>
                <div className="text-[12px] font-manrope-semibold text-grey-500 flex  w-full">
                    <p className="flex-1">{props.info.name}</p>
                    <p className="flex-1">{props.info.section}</p>
                </div>
            </div>


            <div className="flex flex-col justify-between items-center">

                <p className="font-manrope-semibold text-end  text-grey-400 text-[12px]">Requested at {ConvertTime(props.info.time_requested)}</p>
                <Button text="View" onClick={ViewRequest} textStyle="font-manrope-semibold " widthType="medium" roundedFull />
            </div>

        </div>
    )
}




function RoomsContainer() {
    const [realtimes, setRealtimes] = useState(null);
    const [accepted, setAccepted] = useState<Array<AcceptDBTypes>>([]);
    const [floor, setFloor] = useState(1);

    const removeExpiredAccepts = async (id: Array<string>) => {
        for (let i = 0; i < id.length; i++) {
            const invalidRef = ref(realtime_database, `schedule/accepted/${id[i]}`);
            await remove(invalidRef);
        }

    }
    useEffect(() => {


        const ref_ = ref(realtime_database, "schedule/rooms");
        onValue(ref_, (snapshot) => {
            const snap = snapshot.val();
            if (realtimes != snap && snap) {
                setRealtimes(snapshot.val());
            }
        })

        const ref_accepted = ref(realtime_database, "schedule/accepted");
        onValue(ref_accepted, (snapshot) => {
            if (snapshot.val() && accepted != snapshot.val()) {
                const data: AcceptDBTypes[] = Object.entries(snapshot.val()).map(([id, value]) => ({
                    ...(value as Omit<AcceptDBTypes, "id">),
                    id,
                }));

                let expired = data.filter(x => x.day_validity != getTodayDate());
                if (expired.length > 0) {
                    removeExpiredAccepts(expired.map(x => x.id));
                }
                setAccepted(data.filter(x => x.day_validity == getTodayDate()));
            }
        })

    }, []);



    return (
        <Baseline>

            <div className="relative h-full m-1">
                <div className="absolute h-full  w-full pointer-events-none">
                    <InteractiveRoomsContainer floor={floor} realtimes={realtimes} accepted={accepted} />
                </div>
                <div className="w-full flex h-7 mb-2 rounded-full overflow-hidden">
                    <div onClick={() => setFloor(1)} className={((floor == 1) ? "text-grey-950" : "text-grey-400") + " justify-center items-center flex h-full flex-1 cursor-pointer font-manrope-semibold bg-grey-200 hover:bg-grey-300/70"}>
                        <p className="text-[14px]">Floor 1</p>
                    </div>
                    <div onClick={() => setFloor(2)} className={((floor == 2) ? "text-grey-950" : "text-grey-400") + " justify-center items-center flex h-full flex-1 cursor-pointer font-manrope-semibold bg-grey-200 hover:bg-grey-300/70"}>
                        <p className="text-[14px]">Floor 2</p>
                    </div>

                    <div onClick={() => setFloor(3)} className={((floor == 3) ? "text-grey-950" : "text-grey-400") + " justify-center items-center flex h-full flex-1 cursor-pointer font-manrope-semibold bg-grey-200 hover:bg-grey-300/70"}>
                        <p className="text-[14px]">Floor 3</p>
                    </div>
                </div>

                <img className="  h-[calc(100vh-260px)] min-h-[537px]" src={`images/floor_${floor}.png`} />
            </div>
        </Baseline>
    )
}



function InteractiveRoomsContainer(props: { floor: number, realtimes: any, accepted: Array<AcceptDBTypes> }) {
    const main = useMainScheduleStore();
    const getWeekDay = () => {
        const daysOfWeek: Array<"Sunday" | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday"> = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const today = new Date();
        return daysOfWeek[today.getDay()];
    }
    const ConvertTime = (x: TimeType) => {
        const [hours, minutes] = x.split(":");

        const hours_value = parseInt(hours);

        const ampm = hours_value >= 12 ? "PM" : "AM";

        const hours_format = hours_value % 12 || 12;
        return `${hours_format}:${minutes} ${ampm}`;
    }
    const GetFloorsData = () => {
        const hours = new Date().getHours();
        const minutes = new Date().getMinutes();
        const day = getWeekDay();
        // let day = "Monday";
        const current_time_value = ((hours * 60) + minutes);
        const data = FilterResult(1, main.get!.data, main.get!.rooms.map(x => x.room_name));

        const GetDayAvailability = (time: Array<{ start: TimeType, end: TimeType }>) => {
            let available = true;
            let text = "";
            for (let i = 0; i < time.length; i++) {
                if (current_time_value >= ConvertTimeToValue(time[i].start) && ConvertTimeToValue(time[i].end) >= current_time_value) {
                    available = false;
                    text = ConvertTime(time[i].start) + " - " + ConvertTime(time[i].end);
                    break;
                }
            }
            return { available: available, text: text };
        }

        const GetDayInfo = (room_data: Array<RoomSessionSchedule>, room_name: string) => {
          
            const filtered = props.accepted.filter(x=> x.room == room_name);
          

            if (filtered.length > 0){
                for (let i = 0 ; i < filtered.length ; i++){
                    room_data.push({
                        time_start: RevertTime(filtered[i].time_start),
                        time_end: RevertTime(filtered[i].time_end),
                        duration:0,
                        section: filtered[i].section,
                        year: 1 as YearType,
                        course: {
                            code: "",
                            title:"",
                        },
                        instructor:{
                            first_name:"(student)" + filtered[i].name,
                            last_name: "",
                        },
                        subject: {
                            code:"requested",
                            title:"",
                        }
                    });
                }
            }

            const times = room_data.map(x => ({ start: x.time_start, end: x.time_end }));

            const current_availability = GetDayAvailability(times);
            let time_display = "Room is available until end of the day";

            let added = false;
            const allocation = room_data.map(x => {
                const time = ConvertTime(x.time_start) + " - " + ConvertTime(x.time_end);
                const instructor = x.instructor.first_name + " " + x.instructor.last_name;


                if (current_time_value >= ConvertTimeToValue(x.time_start) && ConvertTimeToValue(x.time_end) >= current_time_value) {
                    time_display = "Current:" + time;
                    added = true;
                }
                else if (!added && ConvertTimeToValue(x.time_start) > current_time_value) {
                    added = true;
                    time_display = "Next Session in:" + time;
                }
                return { time: time, section: x.section, subject: x.subject.code, instructor: instructor }
            })

            return {
                available: current_availability.available,
                text: current_availability.text,
                allocation: allocation,
                time_display: time_display
            }
        }

        const result: Array<FloorType> = data.map(x => {
            let available = true;
            let text = "";
            let allocation: Array<AllocatedListType> = [];
            let time_display = "Room is available until end of the day";
            if (day == "Monday" && x.monday_schedule) {
                const day_info = GetDayInfo(x.monday_schedule as Array<RoomSessionSchedule>, x.filter);
                available = day_info.available;
                text = day_info.text;
                allocation = day_info.allocation;
                time_display = day_info.time_display;
            }
            else if (day == "Tuesday" && x.tuesday_schedule) {
                const day_info = GetDayInfo(x.tuesday_schedule as Array<RoomSessionSchedule>, x.filter);
                available = day_info.available;
                text = day_info.text;
                allocation = day_info.allocation;
                time_display = day_info.time_display;
            }
            else if (day == "Wednesday" && x.wednesday_schedule) {
                const day_info = GetDayInfo(x.wednesday_schedule as Array<RoomSessionSchedule>, x.filter);
                available = day_info.available;
                text = day_info.text;
                allocation = day_info.allocation;
                time_display = day_info.time_display;
            }
            else if (day == "Thursday" && x.thursday_schedule) {
                const day_info = GetDayInfo(x.thursday_schedule as Array<RoomSessionSchedule>, x.filter);
                available = day_info.available;
                text = day_info.text;
                allocation = day_info.allocation;
                time_display = day_info.time_display;
            }
            else if (day == "Friday" && x.friday_schedule) {
                const day_info = GetDayInfo(x.friday_schedule as Array<RoomSessionSchedule>, x.filter);
                available = day_info.available;
                text = day_info.text;
                allocation = day_info.allocation;
                time_display = day_info.time_display;
            }
            else if (day == "Saturday" && x.saturday_schedule) {
                const day_info = GetDayInfo(x.saturday_schedule as Array<RoomSessionSchedule>, x.filter);
                available = day_info.available;
                text = day_info.text;
                allocation = day_info.allocation;
                time_display = day_info.time_display;
            }
            else if (day == "Sunday") {
                available = false;
                time_display = "Unavailable"
            }
            main.get!.rooms.map(x => x.room_name)
            const match_name = main.get!.rooms.find(y => x.filter == y.room_name && y.is_realtime);
            if (match_name) {
                if (props.realtimes != null && day != "Sunday") {
                    if (match_name.realtime_id && props.realtimes.hasOwnProperty(match_name.realtime_id)) {
                        const value = props.realtimes[match_name.realtime_id];
                        available = !value.occupied;

                    }

                }
            }

            return { is_available: available, name: x.filter, text: text, allocation: allocation, time_display: time_display }


        })
        return result;
    }

    const floor_arr: Array<FloorType> = GetFloorsData();

    const AssignFloors = (InputArray: Array<FloorType>) => {
        let floors: Array<FloorType> = [];
        const saved_floors =
            [
                "107", "r2", "r3", "r4", "r5", "r6", "r7", "r8",
                "r9", "r10", "r11", "r12", "r13", "r14", "PRRC202", "r15",
                "r16", "r17", "r18", "r19", "r20", "r21", "r22", "r23"
            ]
        const input_buffer: Array<FloorType> = [];
        InputArray.forEach(x => {

            if (saved_floors.includes(x.name)) {
                const index = saved_floors.findIndex(y => y == x.name);
                floors[index] = x;
                input_buffer.push(x);
            }
        })

        InputArray.forEach(x => {
            if (!input_buffer.includes(x)) {
                for (let i = 0; i < saved_floors.length; i++) {
                    if (!floors[i]) {
                        floors[i] = x;
                        break;
                    }
                }
            }
        })
        let dat: Array<FloorType> = [];
        switch (props.floor) {
            case 1:
                dat = floors.slice(0, 8);
                break;
            case 2:
                dat = floors.slice(8, 16);
                break;
            case 3:
                dat = floors.slice(16, 24);
                break;
        }

        return dat;
    }

    const floors = AssignFloors(floor_arr);


    return (
        <div className="items-center w-full h-full ">
            <div className="justify-between flex w-full h-full ">

                <div className="w-1/2 h-[calc(100%-36px)] mt-[36px] ">
                    <div className="h-[8%]" />
                    {(floors[0]) ? <InteractiveRoom time_display={floors[0].time_display} allocation_list={floors[0].allocation} is_available={floors[0].is_available} room_name={floors[0].name} text={floors[0].text} /> : <UnallocatedRoom />}
                    {(floors[1]) ? <InteractiveRoom time_display={floors[1].time_display} allocation_list={floors[1].allocation} is_available={floors[1].is_available} room_name={floors[1].name} text={floors[1].text} /> : <UnallocatedRoom />}
                    <div className="h-[12%]" />
                    {
                        (props.floor != 3) ?
                            (
                                <>
                                    {(floors[2]) ? <InteractiveRoom time_display={floors[2].time_display} allocation_list={floors[2].allocation} is_available={floors[2].is_available} room_name={floors[2].name} text={floors[2].text} /> : <UnallocatedRoom />}
                                    {(floors[3]) ? <InteractiveRoom time_display={floors[3].time_display} allocation_list={floors[3].allocation} is_available={floors[3].is_available} room_name={floors[3].name} text={floors[3].text} /> : <UnallocatedRoom />}
                                </>
                            )
                            :
                            (
                                <>
                                    <div className="h-[20.5%]" />
                                    {(floors[2]) ? <CustomInteractiveRoom height="h-[16%]" time_display={floors[2].time_display} allocation_list={floors[2].allocation} is_available={floors[2].is_available} room_name={floors[2].name} text={floors[2].text} /> : <CustomUnallocatedRoom height="h-[16%]" />}
                                </>
                            )
                    }

                </div>
                <div className=" w-1/2  h-[calc(100%-36px)] mt-[36px] flex flex-col items-end">
                    <div className="h-[8%] " />
                    {
                        (props.floor != 3) ?
                            (
                                <>
                                    {(floors[4]) ? <InteractiveRoom time_display={floors[4].time_display} allocation_list={floors[4].allocation} is_available={floors[4].is_available} room_name={floors[4].name} text={floors[4].text} /> : <UnallocatedRoom />}
                                    {(floors[5]) ? <InteractiveRoom time_display={floors[5].time_display} allocation_list={floors[5].allocation} is_available={floors[5].is_available} room_name={floors[5].name} text={floors[5].text} /> : <UnallocatedRoom />}
                                    <div className="h-[12%] " />
                                    {(floors[6]) ? <InteractiveRoom time_display={floors[6].time_display} allocation_list={floors[6].allocation} is_available={floors[6].is_available} room_name={floors[6].name} text={floors[6].text} /> : <UnallocatedRoom />}
                                    {(floors[7]) ? <InteractiveRoom time_display={floors[7].time_display} allocation_list={floors[7].allocation} is_available={floors[7].is_available} room_name={floors[7].name} text={floors[7].text} /> : <UnallocatedRoom />}
                                </>
                            )
                            :
                            (
                                <>
                                    {(floors[3]) ? <InteractiveRoom time_display={floors[3].time_display} allocation_list={floors[3].allocation} is_available={floors[3].is_available} room_name={floors[3].name} text={floors[3].text} /> : <UnallocatedRoom />}
                                    {(floors[4]) ? <InteractiveRoom time_display={floors[4].time_display} allocation_list={floors[4].allocation} is_available={floors[4].is_available} room_name={floors[4].name} text={floors[4].text} /> : <UnallocatedRoom />}
                                    <div className="h-[12%] " />
                                    {(floors[5]) ? <InteractiveRoom time_display={floors[5].time_display} allocation_list={floors[5].allocation} is_available={floors[5].is_available} room_name={floors[5].name} text={floors[5].text} /> : <UnallocatedRoom />}
                                    {(floors[6]) ? <InteractiveRoom time_display={floors[6].time_display} allocation_list={floors[6].allocation} is_available={floors[6].is_available} room_name={floors[6].name} text={floors[6].text} /> : <UnallocatedRoom />}
                                </>
                            )
                    }
                </div>


            </div>
        </div>
    )


}


function UnallocatedRoom() {
    return (
        <div className="w-[80%] h-[18%] ">
            <div className="w-full h-full grid place-content-center">
                <p className="font-manrope-medium w-full text-center text-[14px] text-grey-400">ROOM UNUSED</p>
            </div>
        </div>
    )
}


function InteractiveRoom(props: { is_available: boolean, room_name: string, text: string, allocation_list: Array<AllocatedListType>, time_display: string }) {
    const ui_state = useUIStore();

    const ViewInfo = () => {

        const view_schedule: ViewListedScheduleType = {
            room_name: props.room_name,
            is_available: props.is_available,
            allocated_list: props.allocation_list,
            time_display: props.time_display
        }
        ui_state.get.modal = "view listed schedule";
        ui_state.get.modal_view_listed = view_schedule;
        ui_state.set();
    }


    return (
        <div className="w-[80%] h-[18%] hover:bg-black/5 cursor-pointer pointer-events-auto" onClick={ViewInfo}>
            <div className="w-full h-full grid place-content-center">
                <p className={((props.is_available) ? "text-grey-900" : "text-grey-750") + " font-manrope-semibold text-[16px] w-full text-center"} >{props.room_name.toUpperCase()}</p>
                <p className={((props.is_available) ? "text-[#2ac739]" : "text-[#F57272]") + " font-manrope-semibold text-[12px]  w-full text-center"}>{(props.is_available) ? "Available" : "Unavailable"}</p>
                <p className="text-[#F57272] font-manrope-semibold text-[8px] opacity-50">{props.text}</p>
            </div>
        </div>
    )

}


function CustomUnallocatedRoom(props: { height: string }) {
    return (
        <div className={"w-[80%] " + props.height}>
            <div className="w-full h-full grid place-content-center">
                <p className="font-manrope-medium w-full text-center text-[14px] text-grey-400">ROOM UNUSED</p>
            </div>
        </div>
    )
}

function CustomInteractiveRoom(props: { height: string, is_available: boolean, room_name: string, text: string, allocation_list: Array<AllocatedListType>, time_display: string }) {
    return (
        <div className={"w-[80%] " + props.height}>
            <div className="w-full h-full grid place-content-center">
                <p className={((props.is_available) ? "text-grey-900" : "text-grey-750") + " font-manrope-semibold text-[16px] w-full text-center"} >{props.room_name.toUpperCase()}</p>
                <p className={((props.is_available) ? "text-[#2ac739]" : "text-[#F57272]") + " font-manrope-semibold text-[12px]  w-full text-center"}>{(props.is_available) ? "Available" : "Unavailable"}</p>
                <p className="text-[#F57272] font-manrope-semibold text-[8px] opacity-50">{props.text}</p>
            </div>
        </div>
    )
}
