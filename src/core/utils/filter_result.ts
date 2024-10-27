import { DataFiltered, InstructorSessionSchedule, IScheduleBufferType, RoomSessionSchedule } from "../../types/core_types";
import { YearType } from "../../types/types";





function filterRoomSessionSchedule(data: Array<IScheduleBufferType>) {
    const filtered_day_session = data.map(x => {
        const day_schedule: RoomSessionSchedule = {
            time_start: x.time_start,
            time_end: x.time_end,
            duration: (x.subject.is_dividable) ? (x.subject.total_hours / 2) : x.subject.total_hours,
            section: x.section,
            year: parseInt(x.section[0]) as YearType,
            course: {
                code: x.course.code,
                title: x.course.name
            },
            instructor: {
                first_name: x.instructor.first_name,
                last_name: x.instructor.last_name
            },
            subject: {
                code: x.subject.code,
                title: x.subject.title
            }
        }
        return day_schedule;
    })

    return filtered_day_session;
}


function filterInstructorSessionSchedule(data: Array<IScheduleBufferType>, room: Array<string>) {
    const filtered_day_session = data.map(x => {
        const day_schedule: InstructorSessionSchedule = {
            time_start: x.time_start,
            time_end: x.time_end,
            duration: (x.subject.is_dividable) ? (x.subject.total_hours / 2) : x.subject.total_hours,
            section: x.section,
            year: parseInt(x.section[0]) as YearType,
            course: {
                code: x.course.code,
                title: x.course.name
            },
            subject: {
                code: x.subject.code,
                title: x.subject.title
            },
            room: room[x.room - 1]
        }

        return day_schedule;
    })

    return filtered_day_session;
}


// function FilterYear1SessionSchedule(data:Array<IScheduleBufferType>){
//     const filter_year
// }


export default function FilterResult(filter_type: number, data: Array<IScheduleBufferType>, room_name: Array<string>) {

    const filtered_data: Array<DataFiltered> = [];
   

    if (filter_type == 1) {
        const room_index = data.map(x => x.room).filter((x, i, s) => s.indexOf(x) === i);
        for (let i = 0; i < room_index.length; i++) {
            const filtered_room_index = data.filter(x => x.room == room_index[i]);

            const filtered_monday = filtered_room_index.filter(x => x.day == "monday");
            const filtered_tuesday = filtered_room_index.filter(x => x.day == "tuesday");
            const filtered_wednesday = filtered_room_index.filter(x => x.day == "wednesday");
            const filtered_thursday = filtered_room_index.filter(x => x.day == "thursday");
            const filtered_friday = filtered_room_index.filter(x => x.day == "friday");
            const filtered_saturday = filtered_room_index.filter(x => x.day == "saturday");

            const filtered_monday_session = filterRoomSessionSchedule(filtered_monday);
            const filtered_tuesday_session = filterRoomSessionSchedule(filtered_tuesday);
            const filtered_wednesday_session = filterRoomSessionSchedule(filtered_wednesday);
            const filtered_thursday_session = filterRoomSessionSchedule(filtered_thursday);
            const filtered_friday_session = filterRoomSessionSchedule(filtered_friday);
            const filtered_saturday_session = filterRoomSessionSchedule(filtered_saturday);

            const object_filtered_room: DataFiltered = {
                filter: room_name[i],
                ...((filtered_monday.length > 0) && { monday_schedule: filtered_monday_session }),
                ...((filtered_tuesday.length > 0) && { tuesday_schedule: filtered_tuesday_session }),
                ...((filtered_wednesday.length > 0) && { wednesday_schedule: filtered_wednesday_session }),
                ...((filtered_thursday.length > 0) && { thursday_schedule: filtered_thursday_session }),
                ...((filtered_friday.length > 0) && { friday_schedule: filtered_friday_session }),
                ...((filtered_saturday.length > 0) && { saturday_schedule: filtered_saturday_session }),

            }
            filtered_data.push(object_filtered_room);
        }
    }
    else if (filter_type == 2) {
        const instructor_index = data.map(x => x.instructor).filter((x, i, s) => s.indexOf(x) === i);
        for (let i = 0; i < instructor_index.length; i++) {
            const filtered_instructor_index = data.filter(x => x.instructor == instructor_index[i]);
            const filtered_monday = filtered_instructor_index.filter(x => x.day == "monday");
            const filtered_tuesday = filtered_instructor_index.filter(x => x.day == "tuesday");
            const filtered_wednesday = filtered_instructor_index.filter(x => x.day == "wednesday");
            const filtered_thursday = filtered_instructor_index.filter(x => x.day == "thursday");
            const filtered_friday = filtered_instructor_index.filter(x => x.day == "friday");
            const filtered_saturday = filtered_instructor_index.filter(x => x.day == "saturday");

            const filtered_monday_session = filterInstructorSessionSchedule(filtered_monday, room_name);
            const filtered_tuesday_session = filterInstructorSessionSchedule(filtered_tuesday, room_name);
            const filtered_wednesday_session = filterInstructorSessionSchedule(filtered_wednesday, room_name);
            const filtered_thursday_session = filterInstructorSessionSchedule(filtered_thursday, room_name);
            const filtered_friday_session = filterInstructorSessionSchedule(filtered_friday, room_name);
            const filtered_saturday_session = filterInstructorSessionSchedule(filtered_saturday, room_name);


            const ins = instructor_index[i];
            const object_filtered_instructor: DataFiltered = {
                filter: ins.first_name + ins.last_name,
                ...((filtered_monday.length > 0) && { monday_schedule: filtered_monday_session }),
                ...((filtered_tuesday.length > 0) && { tuesday_schedule: filtered_tuesday_session }),
                ...((filtered_wednesday.length > 0) && { wednesday_schedule: filtered_wednesday_session }),
                ...((filtered_thursday.length > 0) && { thursday_schedule: filtered_thursday_session }),
                ...((filtered_friday.length > 0) && { friday_schedule: filtered_friday_session }),
                ...((filtered_saturday.length > 0) && { saturday_schedule: filtered_saturday_session }),
                availibility:{
                    ...((ins.monday) &&{monday_schedule:ins.monday}),
                    ...((ins.tuesday) &&{tuesday_schedule:ins.tuesday}),
                    ...((ins.wednesday) &&{wednesday_schedule:ins.wednesday}),
                    ...((ins.thursday) &&{thursday_schedule:ins.thursday}),
                    ...((ins.friday) &&{friday_schedule:ins.friday}),
                    ...((ins.saturday) &&{saturday_schedule:ins.saturday}),
                }

            }
            filtered_data.push(object_filtered_instructor);
        }

    }
    else if (filter_type == 3) {
        // const year: Array<YearFiltered> = [];
        //parseInt(x.section[0]) as YearType
        // const year_index = optimized_data.map(x => x.section[0] == "1").filter((x, i, s) => s.indexOf(x) === i);
        // const year_index: Array<YearType> = [1, 2, 3, 4,];
        // for (let i = 0; i < year_index.length;i++){
        //     const filtered_year_index = optimized_data.filter(x=> x.section[0] ==)
        // }
        // const filtered_year = optimized_data.filter(x => x.section[0] == "1");
        // const filtered_monday = filtered_year.filter(x => x.day == "monday");
        // const filtered_tuesday = filtered_year.filter(x => x.day == "tuesday");
        // const filtered_wednesday = filtered_year.filter(x => x.day == "wednesday");
        // const filtered_thursday = filtered_year.filter(x => x.day == "thursday");
        // const filtered_friday = filtered_year.filter(x => x.day == "friday");
        // const filtered_saturday = filtered_year.filter(x => x.day == "saturday");


    }



    return filtered_data;
}