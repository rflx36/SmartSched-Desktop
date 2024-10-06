import { TimeAllocationBufferType } from "../../types/core_types";
import { TimeType, WeekType } from "../../types/types";
import { ConvertTimeToValue } from "./time_converter";


export default function CheckAvailability(
    allocation_store: Array<TimeAllocationBufferType>,
    type_index: number,
    time_start: TimeType,
    time_end: TimeType,
    day: WeekType) {

    const time_start_value = ConvertTimeToValue(time_start);
    const time_end_value = ConvertTimeToValue(time_end);
    const days: Array<WeekType> = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const day_index = days.indexOf(day);

    const data = allocation_store.filter(x => x.startsWith(`${type_index};${day_index};`));
    const time_allocation_list = data.map(x => x.split(';').pop() as TimeType);
    const time_allocation_before = time_allocation_list.filter(x => ConvertTimeToValue(x) < time_start_value);
    const time_allocation_between = time_allocation_list.filter(x => time_start_value <= ConvertTimeToValue(x) && ConvertTimeToValue(x) < time_end_value);
    const time_allocation_after = time_allocation_list.filter(x => ConvertTimeToValue(x) > time_end_value);
    
    if (time_allocation_before.length != 0) {
        const time_allocation_before_values = time_allocation_before.map(x => ConvertTimeToValue(x));
        const previous_time_allocation_index = Math.max(...time_allocation_before_values);

        if (previous_time_allocation_index < time_start_value && previous_time_allocation_index % 2 == 0) {
            return true;
        }
    }
    if (time_allocation_after.length != 0) {
        const time_allocation_after_values = time_allocation_after.map(x => ConvertTimeToValue(x));
        const next_time_allocation_index = Math.min(...time_allocation_after_values);
        
        if (next_time_allocation_index > time_end_value && next_time_allocation_index % 2 != 0) {
            return true;
        }
    }
    return (time_allocation_between.length != 0);

}