import { ref, set } from "firebase/database";
import {  IScheduleBufferType } from "../types/core_types";
import { realtime_database } from "./firebase_config";
import {  RoomType, SemesterType } from "../types/types";






export async function UploadScheduleToMain(inputs: {
    semester: SemesterType,
    rooms: Array<RoomType>,
    data: Array<IScheduleBufferType>
}) {
    try {
        await set(ref(realtime_database, "schedule/main"), {
            ...inputs
        })
        console.log("main schedule changed successfully");
    }
    catch (e) {
        console.log(e);
        console.log(inputs);
    }


    // update(ref(realtime_database),)
}
