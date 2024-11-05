import { child, get, push, ref, set } from "firebase/database";
import { realtime_database } from "./firebase_config";
import { MainScheduleType} from "../types/types";



const formatDate = () => {
    const date = new Date();

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${month}/${day}/${year}-${hours}:${minutes}`;
};


export async function UploadScheduleToMain(inputs: MainScheduleType) {
    try {
        const current = ref(realtime_database);
        await get(child(current, "schedule/main")).then(async (snapshot) => {
            if (snapshot.exists()) {
                const current_data = snapshot.val();
                const date = formatDate();
                await push(ref(realtime_database, "schedule/history"), {
                    ...current_data,
                    date: date
                })
            }
        })

        await set(ref(realtime_database, "schedule/main"), {
            ...inputs
        })


        console.log("main schedule changed successfully");
    }
    catch (e) {
        console.log(e);
        console.log(inputs);
    }
}
