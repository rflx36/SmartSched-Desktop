import { child, get, ref } from "firebase/database";
import { realtime_database } from "./firebase_config";





export async function FetchScheduleMain() {
    const current = ref(realtime_database);
    let data = null;
    await get(child(current, "schedule/main")).then((snapshot) => {
        data = (snapshot.exists())?snapshot.val():null;
    })
    return data;
}