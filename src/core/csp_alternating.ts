import { ICSP, TimeAllocationBufferType } from "../types/core_types";
import { CourseType, CurrentSemester, InstructorType, Subject, SubjectHasLabLec, TimeType, WeekType, YearType } from "../types/types";
import CheckRoomTimeAvailability from "./utils/check_room_time_availability";


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

    private buffer_rooms_allocation: Array<TimeAllocationBufferType> = [];
    private buffer_instructors_allocation: Array<TimeAllocationBufferType> = [];


    private selected_index_room: number = 0;
    private selected_index_course: number = 0;
    private selected_index_subject: number = 0;
    private selected_index_room_lab: number = 0;
    private selected_index_instructor: number = 0;

    private selected_list_subjects: Array<Subject | SubjectHasLabLec> = [];
    private selected_section: string = "";
    private selected_year: YearType = 1;
    private selected_day: WeekType = "monday";
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

                // if (!this.SetSections(current_data.sections)) {
                //     return false;
                // }


            }

        }
    }

    private SetSections(sections_amount: number) {

        for (let i = 0; i < sections_amount; i++) {
            this.selected_section = (this.selected_year + String.fromCharCode(96 + i)).toUpperCase();
            this.selected_day = "monday";

        }
    }

    private SetRooms() {
        let current_hours_occupied = 0;
        const current_subjects = this.selected_list_subjects;
        for (let i = 0; current_subjects.length; i++) {
            if ((current_subjects[i] as Subject).total_hours == undefined) {
                const subject = current_subjects[i] as SubjectHasLabLec;
                current_hours_occupied += subject.lec_total_hours;
            }
            else {
                const subject = current_subjects[i] as Subject;
                current_hours_occupied += subject.total_hours;
            }
        }
        // const room_sessions_available =
        //     CheckRoomTimeAvailability(
        //         this.buffer_rooms_allocation,
        //         this.selected_index_room,
        //         this.time_start,
        //         this.time_end,
        //         this.break_time_start,
        //         this.break_time_end,
        //         this.days.length,
        //         this.max_session,
        //         this.use_session);

    }
}