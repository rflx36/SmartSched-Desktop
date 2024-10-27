import { ICSP, IScheduleBufferType, TimeAllocationBufferType } from "../types/core_types";
import { CourseType, CurrentSemester, InstructorType, Subject, SubjectHasLabLec, TimeType, WeekType, YearType } from "../types/types";
import GetRoomFreeTime from "./utils/get_room_free_time";
import CheckRoomTimeAvailability from "./utils/check_room_time_availability";
import { ConvertTimeToValue, ConvertValueToTime } from "./utils/time_converter";
import CheckSubjectIsLecLab from "./utils/check_subject_type";
import { GetPrecedingDay } from "./utils/time_modifier";


export default class SchedulingCSPAlternating {

    private default_time_start: TimeType = "00:00";
    private default_time_end: TimeType = "00:00";
    private default_break_time_start: TimeType = "00:00";
    private default_break_time_end: TimeType = "00:00";
    private default_list_instructors: Array<InstructorType> = [];
    private default_list_rooms_lab: Array<string> = [];
    private default_list_courses: Array<CourseType> = [];
    private default_list_rooms: Array<string> = [];
    private default_list_data: Array<CurrentSemester> = [];
    private default_list_days: Array<WeekType> = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    private default_subsequent_days_interval: number = 3;

    private buffer_rooms_allocation: Array<TimeAllocationBufferType> = [];
    private buffer_instructors_allocation: Array<TimeAllocationBufferType> = [];

    private buffer_selected_index_room: Array<number> = [];
    private buffer_selected_index_subject: Array<number> = [];
    private buffer_selected_instructor: Array<number> = [];
    private buffer_selected_time: Array<TimeType> = [];

    private buffer_schedule_result_queue: Array<IScheduleBufferType> = [];
    private buffer_schedule_result: Array<IScheduleBufferType> = [];

    private buffer_subjects_queue: Array<Subject | SubjectHasLabLec > = [];

    private selected_index_room: number = 0;
    private selected_index_course: number = 0;
    private selected_index_subject: number = 0;
    private selected_index_room_lab: number = 0;
    private selected_index_instructor: number = 0;


    private selected_time_end: TimeType = "00:00";
    private selected_time_start: TimeType = "00:00";
    private selected_list_subjects: Array<Subject | SubjectHasLabLec> = [];
    private selected_subject: Subject = { title: "", code: "", total_hours: 0, is_dividable: false };
    private selected_section: string = "";
    private selected_year: YearType = 1;
    private selected_day: WeekType = "monday";
    private selected_subsequent_day: WeekType = "thursday";
    private selected_course: CourseType = { name: "", code: "" }


    constructor(inputs: ICSP) {
        this.default_list_data = inputs.data;
        this.default_list_instructors = inputs.instructors;
        this.default_list_courses = inputs.courses;
        this.default_list_rooms = inputs.rooms;
        this.default_list_rooms_lab = inputs.rooms_lab;
        this.default_time_start = inputs.time_start;
        this.default_time_end = inputs.time_end;
        this.default_break_time_start = inputs.break_time_start;
        this.default_break_time_end = inputs.break_time_end;
    }


    public async Solve() {

        for (let i = 0; i < this.default_list_courses.length; i++) {
            this.selected_course = this.default_list_courses[i];
            for (let year = 1; year <= 4; year++) {
                this.selected_year = year as YearType;

                const current_data = this.default_list_data.find(x => x.year == this.selected_year && x.course == this.selected_course.code);
                if (current_data == undefined) {
                    continue;
                }
                this.selected_list_subjects = current_data.subjects;
                if (!this.SetSections(current_data.sections)) {
                    return false;
                }
            }

        }
    }
    private UpdateDay(day: WeekType) {
        this.selected_day = day;
        this.selected_subsequent_day = GetPrecedingDay(day, this.default_subsequent_days_interval);
    }
    private SetSections(sections_amount: number) {

        this.buffer_selected_index_room = [];
        let section_processed = 0;
        let loop_limiter = 0;
        let current_sections_amount = 0;
        while (sections_amount > section_processed) {
            if (loop_limiter > 100) {
                return false;
            }
            loop_limiter++;

            if (current_sections_amount < 2 && current_sections_amount < (sections_amount - section_processed)) {
                current_sections_amount++;
                continue;
            }
            else {
                const section_assigned = current_sections_amount;
                current_sections_amount = 0;
                const sections_list = [];
                for (let i = 1; i <= section_assigned; i++) {
                    const section_name = (this.selected_year + String.fromCharCode(96 + i + section_processed)).toUpperCase();
                    sections_list.push(section_name);
                }
                if (!this.SetDay(sections_list)) {
                    return false;
                }
                this.selected_index_room++;
                section_processed += section_assigned;
            }
        }
        return true;
    }

    private SetDay(sections: Array<string>) {
        const morning_session = this.default_time_start;
        const afternoon_session = this.default_break_time_end;

        for (let i = 0; i < this.default_list_days.length; i++) {
            this.UpdateDay(this.default_list_days[i]);
            
            // if ()
            // this.buffer_subjects_queue =
            this.selected_time_start = (i % 2) ? morning_session : afternoon_session;
            this.selected_section = sections[0];

            if (!this.SetTime()) {
                return false;
            }
            if (sections[1] != undefined) {
                this.selected_time_start = (i % 2) ? afternoon_session : morning_session;
                this.selected_section = sections[1];
                if (!this.SetTime()) {
                    return false;
                }
            }
            // remove the added subjects in selected_list_subject

        }
        return true;
    }


    private SetTime() {
        const session_limit = 0;
        // called twice for morning section 1 and afternoon section 2


        //check for current time / day availability of both  room and instructor (including subsequents)
        //assign the following 3 subjects along side the subsequent to the current time / day  and allocation buffer for both room and instructor
        
        return true;
    }

    private SetSubject(current_path: Array<number>, iterate: number) {
        if (iterate >= this.selected_list_subjects.length) {
            return true;
        }
        const path_available_list = this.selected_list_subjects.filter((_, i) => !current_path.includes(i));

        for (let i = 0; i < path_available_list.length; i++) {
            const subject_index = this.selected_list_subjects.indexOf(path_available_list[i]);
        }
    }

    // private SetRooms(current_room_index: number) {
    //     if (this.buffer_selected_index_room.includes(current_room_index)) {
    //         if (current_room_index < this.default_list_rooms.length) {
    //             this.SetRooms(current_room_index + 1);
    //         }
    //         return;
    //     }
    //     let FillTime = 0;
    //     const current_subjects = this.selected_list_subjects;
    //     for (let i = 0; i < current_subjects.length; i++) {
    //         if ((current_subjects[i] as Subject).total_hours == undefined) {
    //             const subject = current_subjects[i] as SubjectHasLabLec;
    //             FillTime += subject.lec_total_hours;
    //         }
    //         else {
    //             const subject = current_subjects[i] as Subject;
    //             FillTime += subject.total_hours;
    //         }
    //     }
    //     const break_start = ConvertTimeToValue(this.default_break_time_start);
    //     const break_end = ConvertTimeToValue(this.default_break_time_end);
    //     const FreeTime = GetRoomFreeTime(
    //         this.buffer_rooms_allocation,
    //         current_room_index,
    //         this.default_time_start,
    //         this.default_time_end,
    //         break_start, break_end
    //     )
    //     if (FillTime > FreeTime) {
    //         this.buffer_selected_index_room.push(current_room_index);
    //         if (current_room_index >= this.default_list_rooms.length) {
    //             return;
    //         }
    //         else {

    //             this.SetRooms(current_room_index + 1);
    //             return;
    //         }
    //     }
    //     this.selected_index_room = current_room_index;
    // }

}
