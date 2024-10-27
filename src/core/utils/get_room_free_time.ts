import { TimeAllocationBufferType } from "../../types/core_types";
import { TimeType } from "../../types/types";
import { ConvertTimeToValue, ConvertValueToTime } from "./time_converter";




export default function GetRoomFreeTime(
    room_allocation_store: Array<TimeAllocationBufferType>,
    room_index: number,
    time_start: TimeType,
    time_end: TimeType,
    break_time_start: number,
    break_time_end: number,
) {

    let time_value_available = 0;
    const time_checks_increment = 30;
    const time_start_value = ConvertTimeToValue(time_start);
    const time_end_value = ConvertTimeToValue(time_end);

    for (let day_index = 0; day_index < 6; day_index++) {
        const data = room_allocation_store.filter(x => x.startsWith(`${room_index};${day_index};`));
        const time_allocation_list = data.map(x => x.split(';').pop() as TimeType);

        let in_session = false;
        for (let time = time_start_value; time < time_end_value; time += time_checks_increment) {

            if (time_allocation_list.includes(ConvertValueToTime(time))) {
                in_session = true;
            }
            else if (!in_session) {
                if (time >= break_time_start && time <= break_time_end) {
                    continue;
                }

                time_value_available += time_checks_increment;
            }
            else if (in_session && time_allocation_list.includes(ConvertValueToTime(time - 1))) {
                in_session = false;
            }
        }

    }
    return time_value_available / 60;


}