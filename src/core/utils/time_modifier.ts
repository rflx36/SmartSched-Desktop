import { TimeType, WeekType } from "../../types/types";
import { ConvertTimeToValue } from "../utils/time_converter";

export default function GenerateTimeValues(time_start: TimeType, time_end: TimeType) {
    let time_slots: Array<number> = [];


    const start = ConvertTimeToValue(time_start);
    const end = ConvertTimeToValue(time_end);

    for (let i = start; i <= end; i += 30) {
        if (i == end) {
            time_slots.push(i-1); // 1min offset for the ending time slot to allow availability for the next minute (next session)
        }
        else {

            time_slots.push(i);
        }
    }
    return time_slots;
}





export function AddTime(time: TimeType, value: number = 30) {
    const [hours, minutes] = time.split(':').map(Number);
    const total_minutes = hours * 60 + minutes + value; // 30 minutes interval

    const new_hours = Math.floor(total_minutes / 60) % 24;
    const new_minutes = total_minutes % 60;

    return `${String(new_hours).padStart(2, '0')}:${String(new_minutes).padStart(2, '0')}` as TimeType;
}



export function GetPrecedingDay(current_day: WeekType, interval: number) {
    const days: Array<WeekType> = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

    const current_index = days.indexOf(current_day);
    const new_index = (current_index + interval) % days.length;

    return days[new_index];
}





// turn to values and just map??


// time_start
// time_end
// reject if time_start > time_end
// time_start 07:00 = 420 in value
// time_end 09:30 =  570 in value
// input_ time in between
// time_between = 08:02   = 482 in value
// if input > time_start and time_end > input
// true
// if (482 > 420 &&  570 > 482)true
//if false return false

// dont fill?
// start_time:> end_time:<
// > = defies starting time of a particular thing
// < = defies ending time " "
// if
// array of objects?

// room_name:weekday:time:>
