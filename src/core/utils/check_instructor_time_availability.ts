import { InstructorType, TimeType, WeekType } from "../../types/types";
import { ConvertTimeToValue } from "./time_converter";




export default function CheckInstructorTimeAvailability(
    instructor: InstructorType,
    time_start: TimeType,
    time_end: TimeType,
    day: WeekType
) {

    const t_start_val = ConvertTimeToValue(time_start);
    const t_end_val = ConvertTimeToValue(time_end);
    const days: Array<WeekType> = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const current_day = days.indexOf(day);
    
   
    if (current_day == 0 && instructor.monday) {
        const i_start_val = ConvertTimeToValue(instructor.monday.time_start);
        const i_end_val = ConvertTimeToValue(instructor.monday.time_end);
      
        return !(i_start_val <= t_start_val && i_end_val >= t_end_val)
    }
    if (current_day == 1 && instructor.tuesday) {
        const i_start_val = ConvertTimeToValue(instructor.tuesday.time_start);
        const i_end_val = ConvertTimeToValue(instructor.tuesday.time_end);
        return !(i_start_val <= t_start_val && i_end_val >= t_end_val)
    }
    if (current_day == 2 && instructor.wednesday) {
        const i_start_val = ConvertTimeToValue(instructor.wednesday.time_start);
        const i_end_val = ConvertTimeToValue(instructor.wednesday.time_end);
        return !(i_start_val <= t_start_val && i_end_val >= t_end_val)
    }
    if (current_day == 3 && instructor.thursday) {
        const i_start_val = ConvertTimeToValue(instructor.thursday.time_start);
        const i_end_val = ConvertTimeToValue(instructor.thursday.time_end);
        return !(i_start_val <= t_start_val && i_end_val >= t_end_val)
    }
    if (current_day == 4 && instructor.friday) {
        const i_start_val = ConvertTimeToValue(instructor.friday.time_start);
        const i_end_val = ConvertTimeToValue(instructor.friday.time_end);
        return !(i_start_val <= t_start_val && i_end_val >= t_end_val)
    }
    if (current_day == 5 && instructor.saturday) {
        const i_start_val = ConvertTimeToValue(instructor.saturday.time_start);
        const i_end_val = ConvertTimeToValue(instructor.saturday.time_end);
        return !(i_start_val <= t_start_val && i_end_val >= t_end_val)
    }

    return true;

}