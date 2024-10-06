import { useState } from "react"
import { CourseType, RoomType, TimeType } from "../../../types/types"
import { DEFAULT_CLASS_SESSIONS } from "../../../constants";
import Border from "../../../components/border";
import Baseline from "../../../components/baseline";
import Input from "../../../components/input";
import { ConvertTimeToValue } from "../../../core/utils/time_converter";
import { useUIStore } from "../../../stores/ui_store";
import SwitchOption from "../../../components/switch option";
import Modifier from "../../../components/modifier";




export default function SetupStep_0() {
    const ui_state = useUIStore();
    const [timeStart, setTimeStart] = useState<TimeType>(DEFAULT_CLASS_SESSIONS.time_start);
    const [timeEnd, setTimeEnd] = useState<TimeType>(DEFAULT_CLASS_SESSIONS.time_end);
    const [breakTimeStart, setBreakTimeStart] = useState<TimeType>(DEFAULT_CLASS_SESSIONS.break_time_start);
    const [breakTimeEnd, setBreakTimeEnd] = useState<TimeType>(DEFAULT_CLASS_SESSIONS.break_time_end);
    const [rooms, setRooms] = useState<Array<RoomType>>([]);
    const [courses, setCourses] = useState<Array<CourseType>>([]);


    const [modalRoomName, setModalRoomName] = useState("");
    const [modalRoomType, setModalRoomType] = useState(0);
    const [modalRoomRealtimeId, setModalRoomRealtimeId] = useState("");
    const [modalCourseName, setModalCourseName] = useState("");
    const [modalCourseCode, setModalCourseCode] = useState("");
    const [isModalEditing, setIsModalEditing] = useState(false);

    const [currentEditing, setCurrentEditing] = useState<RoomType | CourseType | null>(null);

    const GetAvailableTime = (t_start: TimeType, t_end: TimeType) => {
        const available_time_value = ConvertTimeToValue(t_end) - ConvertTimeToValue(t_start);
        let available_time = "";
        const available_hours = Math.floor(available_time_value / 60);
        const available_mins = available_time_value % 60;
        if (available_hours != 0) {
            available_time = `${available_hours} ${((available_hours > 1) ? "hrs " : "hr ")}`;
        }
        if (available_mins != 0) {
            available_time += available_mins + ((available_mins > 1) ? "mins" : "min");
        }
        if (available_time == "" || available_hours < 0) {
            available_time = "Invalid"
        }
        return available_time
    }

    const AddRoom = () => {

        const current_room = rooms;
        const current_room_data: RoomType = {
            room_name: modalRoomName.toLocaleUpperCase(),
            is_realtime: (modalRoomType == 1),
            ...(modalRoomRealtimeId != "" && { realtime_id: modalRoomRealtimeId })
        };
        current_room.push(current_room_data);
        setRooms(current_room);

        setModalRoomName("");
        setModalRoomType(0);
        setModalRoomRealtimeId("");
        ui_state.get.modal = "closed";
        ui_state.get.background = false;
        ui_state.set();

    }

    const AddCourse = () => {
        const current_course = courses;
        const current_course_data: CourseType = {
            name: modalCourseName,
            code: modalCourseCode
        }
        current_course.push(current_course_data);
        setCourses(current_course);

        setModalCourseName("");
        setModalCourseCode("");
        ui_state.get.modal = "closed";
        ui_state.get.background = false;
        ui_state.set();

    }
    const EditRoom = (value: RoomType) => {
        setIsModalEditing(true);
        setCurrentEditing(value);
        setModalRoomName(value.room_name);
        setModalRoomType((value.is_realtime) ? 1 : 0);
        if (value.is_realtime) {
            setModalRoomRealtimeId(value.realtime_id as string);
        }
        SetRoom();
    }
    const EditCourse = (value: CourseType) => {
        setIsModalEditing(true);
        setCurrentEditing(value);
        setModalCourseName(value.name);
        setModalCourseCode(value.code);
        SetCourse();
    }

    const ConfirmEditRoom = () => {
        const current_room = rooms;
        const current_room_index = rooms.findIndex(x => x == currentEditing);

        const current_room_data: RoomType = {
            room_name: modalRoomName.toLocaleUpperCase(),
            is_realtime: (modalRoomType == 1),
            ...(modalRoomRealtimeId != "" && { realtime_id: modalRoomRealtimeId })
        };

        current_room[current_room_index] = current_room_data;
        setRooms(current_room);
        setIsModalEditing(false);
        setCurrentEditing(null);

        setModalRoomName("");
        setModalRoomType(0);
        setModalRoomRealtimeId("");
        ui_state.get.modal = "closed";
        ui_state.get.background = false;
        ui_state.set();

    }
    const ConfirmEditCourse = () => {
        const current_course = courses;
        const current_course_index = courses.findIndex(x => x == currentEditing);
        const current_course_data: CourseType = {
            name: modalCourseName,
            code: modalCourseCode
        }
        current_course[current_course_index] = current_course_data;
        setCourses(current_course);
        setIsModalEditing(false);
        setCurrentEditing(null);

        setModalCourseName("");
        setModalCourseCode("");
        ui_state.get.modal = "closed";
        ui_state.get.background = false;
        ui_state.set();
    }


    const DeleteRoom = (value: RoomType) => {
        setRooms(rooms.filter((x) => x != value));
    }
    const DeleteCourse = (value: CourseType) => {
        setCourses(courses.filter((x) => x != value));
    }

    const SetRoom = () => {
        ui_state.get.background = true;
        ui_state.get.modal = "rooms";
        ui_state.set();

    }
    const SetCourse = () => {
        ui_state.get.background = true;
        ui_state.get.modal = "courses";
        ui_state.set();

    }
    const Cancel = () => {
        setModalRoomName("");
        setModalRoomType(0);
        setModalRoomRealtimeId("");
        setModalCourseName("");
        setModalCourseCode("");
        setIsModalEditing(false);
        setCurrentEditing(null);
        ui_state.get.background = false;
        ui_state.get.modal = "closed";
        ui_state.set();
    }
    return (
        <>
            <p className="ml-1 font-manrope-semibold text-grey-900 text-[20px]">School Hours</p>
            <Border>
                <div className="flex ">
                    <div className="w-[500px] ">
                        <Baseline >
                            <div className="flex gap-1 ">
                                <Input type="time" label="Start Time" value={timeStart} onChange={e => setTimeStart(e)} />
                                <Input type="time" label="End Time" value={timeEnd} onChange={e => setTimeEnd(e)} />
                                <div className="bg-baseline-outline rounded-full w-[1px] h-14 m-[6px]"></div>
                                <div className="w-[175px] flex flex-col">
                                    <label className="font-manrope-semibold text-sm mb-1" >Available Hours</label>
                                    <p className="mt-2 font-manrope-medium text-[20px] text-grey-400">{GetAvailableTime(timeStart, timeEnd)}</p>
                                </div>
                            </div>
                        </Baseline>
                    </div>
                    <div className="w-[500px] ">
                        <Baseline >
                            <div className="flex gap-1">
                                <Input type="time" label="Break start Time" value={breakTimeStart} onChange={e => setBreakTimeStart(e)} />
                                <Input type="time" label="Break end Time" value={breakTimeEnd} onChange={e => setBreakTimeEnd(e)} />
                                <div className="bg-baseline-outline rounded-full w-[1px] h-14 m-[6px]"></div>
                                <div className="w-[175px] flex flex-col">
                                    <label className="font-manrope-semibold text-sm mb-1" >Available Break Hours</label>
                                    <p className="mt-2 font-manrope-medium text-[20px] text-grey-400">{GetAvailableTime(breakTimeStart, breakTimeEnd)}</p>
                                </div>
                            </div>
                        </Baseline>
                    </div>
                </div>
            </Border>
            <div className="flex mt-5 justify-between">
                <div className="w-[500px] ">
                    <p className="ml-1 font-manrope-semibold text-grey-900 text-[20px]">Rooms</p>
                    <div className="flex flex-col p-1 w-full h-max border  shadow-inner border-white relative bg-neutral-200/80 rounded-lg">
                        {(ui_state.get.modal == "rooms") ?
                            (
                                <>
                                    <div className="w-[calc(100%-8px)] absolute z-30 top-[-162px]">
                                        <Baseline widthFull>
                                            <Input type="text" label="Room Name" value={modalRoomName} onChange={(x) => setModalRoomName(x)} maxLength={14} />
                                            <label className="ml-1 font-manrope-semibold text-sm mb-1" >Room Type</label>
                                            <div className="flex justify-between items-center">
                                                <SwitchOption active={modalRoomType} onClick={(x) => setModalRoomType(x)} options={["Normal", "Realtime"]} />
                                                {(modalRoomType == 1) ? <Input type="text" placeholder="Realtime ID" value={modalRoomRealtimeId} onChange={(x) => setModalRoomRealtimeId(x)} /> : <></>}

                                            </div>
                                        </Baseline>
                                    </div>
                                    <div className="flex">
                                        <button onClick={Cancel} className=" w-[237px] z-30 bg-baseline-base border-baseline-outline border rounded-md h-10 m-1 text-grey-500 hover:text-grey-750 ">
                                            <p className="font-manrope-bold text-[16px]">Cancel</p>
                                        </button>

                                        {(modalRoomName != "" && ((modalRoomType == 1 && modalRoomRealtimeId != "") || modalRoomType == 0))
                                            ?
                                            (
                                                <button onClick={(isModalEditing) ? ConfirmEditRoom : AddRoom} className="hover:bg-grey-600 w-[237px] z-30 bg-grey-750 border-grey-900 border rounded-md h-10 m-1 text-grey-50">
                                                    <p className="font-manrope-bold text-[16px]">{(isModalEditing ? "Save Changes" : "Add Room")}</p>

                                                </button>
                                            )
                                            :
                                            (
                                                <button className="opacity-50 cursor-not-allowed  w-[237px] z-30 bg-grey-750 border-grey-900 border rounded-md h-10 m-1 text-grey-50">
                                                    <p className="font-manrope-bold text-[16px]">{(isModalEditing ? "Save Changes" : "Add Room")}</p>
                                                </button>
                                            )
                                        }

                                    </div>
                                </>
                            ) : (
                                <button onClick={SetRoom} className="bg-baseline-base border-baseline-outline border rounded-md h-10 m-1 text-grey-500 hover:text-grey-750 ">
                                    <p className=" font-manrope-bold text-[16px]">Add Room </p>
                                </button>
                            )
                        }
                        <div className="w-full min-h-[250px]">
                            {
                                rooms.map((x, i) => {
                                    return (
                                        <div key={i} className="inline-block w-[237px] h-24 m-1 relative rounded-md bg-baseline-base border border-baseline-outline">
                                            <div className="flex items-center mt-1 gap-2">
                                                <p className="font-manrope-semibold text-grey-400 text-[20px] ml-4">{x.room_name}</p>
                                                {(x.is_realtime) ? <img className="size-5 hover:url " src="icons/icon-camera.png" title={x.realtime_id} /> : <></>}
                                            </div>
                                            <div className="w-[calc(100%-8px)] m-1 bottom-0 flex justify-end absolute ">
                                                <Modifier edit={() => EditRoom(x)} delete={() => DeleteRoom(x)} />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="w-[500px]">
                    <p className="ml-1 font-manrope-semibold text-grey-900 text-[20px]">Courses</p>
                    <div className="flex flex-col p-1 w-full h-max border  shadow-inner border-white relative bg-neutral-200/80 rounded-lg">

                        {(ui_state.get.modal == "courses") ?
                            (
                                <>
                                    <div className="w-full absolute z-30 top-[-90px]">
                                        <Baseline widthFull flex>
                                            <Input type="text" size="larger" label="Course name" value={modalCourseName} onChange={(x) => setModalCourseName(x)} />

                                            <Input type="text" label="Abbreviation" value={modalCourseCode} onChange={(x) => setModalCourseCode(x)} />
                                        </Baseline>
                                    </div>
                                    <div className="flex">
                                        <button onClick={Cancel} className=" w-[237px] z-30 bg-baseline-base border-baseline-outline border rounded-md h-10 m-1 text-grey-500 hover:text-grey-750 ">
                                            <p className="font-manrope-bold text-[16px]">Cancel</p>
                                        </button>
                                        {(modalCourseName != "" && modalCourseCode != "")
                                            ?
                                            (
                                                <button onClick={(isModalEditing) ? ConfirmEditCourse : AddCourse} className="hover:bg-grey-600 w-[237px] z-30 bg-grey-750 border-grey-900 border rounded-md h-10 m-1 text-grey-50">
                                                    <p className="font-manrope-bold text-[16px]">{(isModalEditing ? "Save Changes" : "Add Course")}</p>
                                                </button>
                                            )
                                            :
                                            (
                                                <button className="opacity-50 cursor-not-allowed  w-[237px] z-30 bg-grey-750 border-grey-900 border rounded-md h-10 m-1 text-grey-50">
                                                    <p className="font-manrope-bold text-[16px]">{(isModalEditing ? "Save Changes" : "Add Course")}</p>
                                                </button>
                                            )
                                        }

                                    </div>
                                </>
                            ) : (
                                <button onClick={SetCourse} className="bg-baseline-base border-baseline-outline border rounded-md h-10 m-1 text-grey-500 hover:text-grey-750 ">
                                    <p className="font-manrope-bold text-[16px]">Add Course </p>
                                </button>
                            )
                        }

                        <div className="w-full min-h-[250px]">
                            {
                                courses.map((x, i) => {
                                    return (
                                        <div key={i} className="w-[calc(100%-8px)] h-max bg-baseline-base border m-1 border-baseline-outline rounded-md m-1 mb-2">
                                            <p className="font-manrope-semibold text-grey-400 text-[20px] ml-4">{x.code}</p>
                                            <div className="flex justify-between m-1 items-center">
                                                <p className="ml-3 font-manrope-medium text-grey-400 text-[12px]">{x.name}</p>
                                                <Modifier edit={() => EditCourse(x)} delete={() => DeleteCourse(x)} />
                                            </div>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}