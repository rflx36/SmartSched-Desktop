import { TimeAllocationBufferType } from "../../types/core_types";
import { TimeType } from "../../types/types";
import { ConvertTimeToValue, ConvertValueToTime } from "./time_converter";


export default function CheckRoomTimeAvailability(
    room_allocation_store: Array<TimeAllocationBufferType>,
    room_index: number,
    time_start: TimeType,
    time_end: TimeType,
    break_time_start: number,
    break_time_end: number,
    days_available: number,
    max_session:number,
    use_session:boolean
) {
    
    let time_value_available = 0;
    const time_checks_increment = 30;
    const time_start_value = ConvertTimeToValue(time_start);
    const time_end_value = ConvertTimeToValue(time_end);
    let current_session = 0;
    for (let i = 0; i < days_available; i++) {

        const data = room_allocation_store.filter(x => x.startsWith(`${room_index};${i};`));
        const time_allocation_list = data.map(x => x.split(';').pop() as TimeType);
        let in_session = false;
        for (let j = time_start_value; j < time_end_value; j += time_checks_increment) {

            if (time_allocation_list.includes(ConvertValueToTime(j))) {
                in_session = true;
            }
            else if (!in_session) {
                if (j >= break_time_start && j <= break_time_end){
                    continue;
                }
                if (current_session > (max_session * 60) && use_session){
                    break;
                }
                current_session += time_checks_increment;
                time_value_available += time_checks_increment;
            }
            else if (in_session && time_allocation_list.includes(ConvertValueToTime(j - 1))) {
                in_session = false;
            }
        }

    }
    return time_value_available / 60;
}