import { useEffect, useState } from "react";
import Border from "../../components/border";
import Button from "../../components/button";
import { useMainScheduleStore } from "../../stores/main_schedule_store"
import { useUIStore } from "../../stores/ui_store";
import { RequestDBTypes, RequestTypes, TimeType } from "../../types/types";
import { onValue, ref } from "firebase/database";
import { realtime_database } from "../../firebase/firebase_config";
import Baseline from "../../components/baseline";
import { ConvertTimeToValue, ConvertValueToTime } from "../../core/utils/time_converter";






export default function PageDashboard() {
    const main = useMainScheduleStore();
    const ui_state = useUIStore();

    if (main.get == null) {
        return (
            <div className="">
                No Assigned Main Schedule Yet
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



function RoomRequestContainer() {
    const [requests, setRequests] = useState<Array<RequestDBTypes>>([]);

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

            setRequests(requestsWithId);
        })
    }, [])

    console.log(requests);
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
    const [floor, setFloor] = useState(1);

    return (
        <Baseline>
            <div className=" h-full m-1">
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