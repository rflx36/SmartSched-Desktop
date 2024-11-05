import { ICSP, IScheduleBufferType, ISchedulingResultType, TimeAllocationBufferType } from "../types/core_types";
import { CourseType, CurrentSemester, InstructorType, Subject, SubjectHasLabLec, TimeType, WeekType, YearType } from "../types/types";
import ArraysMatch from "./utils/array_match";
import CheckInputsEligibility from "./utils/check_inputs_eligibility";
import CheckAvailability from "./utils/check_availability";
import CheckRoomTimeAvailability from "./utils/check_room_time_availability";
import CheckSubjectIsLecLab from "./utils/check_subject_type";
import { ConvertHourToValue, ConvertTimeToValue, ConvertValueToTime } from "./utils/time_converter";
import { AddTime, GetPrecedingDay } from "./utils/time_modifier";
import CheckInstructorTimeAvailability from "./utils/check_instructor_time_availability";


export default class SchedulingCSP {

    public days: Array<WeekType> = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    public subsequent_subject_day_interval = 3;
    public max_session = 4; // amount of hours for the day
    public use_session = true;
    // public max_instructor_work_hours = 48;
    //inputs
    private instructors: Array<InstructorType> = [];
    private data: Array<CurrentSemester> = [];
    private time_start: TimeType = "00:00";
    private time_end: TimeType = "00:00";
    private break_time_start: number = 0;
    private break_time_end: number = 0;
    private courses: Array<CourseType> = [];
    private rooms: Array<string> = [];
    private rooms_lab: Array<string> = [];
    private rooms_allocation: Array<TimeAllocationBufferType> = [];
    private instructors_allocation: Array<TimeAllocationBufferType> = [];
    private section_allocation: Array<TimeAllocationBufferType> = [];
    private schedule_result_queue: Array<IScheduleBufferType> = [];

    private schedule_result: Array<IScheduleBufferType> = [];
    private current_room: number = 0;
    private current_room_lab: number = 0;
    private current_time_start: TimeType = "00:00";
    private current_time_end: TimeType = "00:00";
    private current_instructor: number = 0;
    private current_subjects: Array<Subject | SubjectHasLabLec> = [];
    private current_subject: Subject = { title: "", code: "", total_hours: 0, is_dividable: false };
    private current_session: Array<number> = [0, 0, 0, 0, 0, 0];
    private current_section: string = "";
    private current_course: CourseType = { name: "", code: "" };
    private current_year: YearType = 1;
    private current_day: WeekType = "monday";
    private current_subsequent_day: WeekType = "thursday";
    private current_is_partitionable: boolean = false;
    private current_section_allocation:number = 0;
    private current_week_buffer: Array<number> = [];
    private inputs: ICSP;


    constructor(inputs: ICSP) {
        this.inputs = inputs;
        this.data = inputs.data;
        this.instructors = inputs.instructors;
        this.courses = inputs.courses;
        this.rooms = inputs.rooms.concat(inputs.rooms_lab);
        this.rooms_lab = inputs.rooms_lab;
        this.time_start = inputs.time_start;
        this.time_end = inputs.time_end;
        this.break_time_start = ConvertTimeToValue(inputs.break_time_start);
        this.break_time_end = ConvertTimeToValue(inputs.break_time_end);
        this.current_room_lab = inputs.rooms.length;
        // this.current_room_lab = this.rooms.length - this.rooms_lab_amount;


    }


    private EnqueueSubjects() {

        const current_time_end_value = ConvertTimeToValue(this.current_time_end);
        const modified_time_end_value = ConvertValueToTime(current_time_end_value - 1);
        const schedule_result: IScheduleBufferType = {
            course: this.current_course,
            room: this.current_room,
            section: this.current_section,
            subject: this.current_subject,
            time_start: this.current_time_start,
            time_end: modified_time_end_value,
            day: this.current_day,
            instructor: this.instructors[this.current_instructor]
        }
        this.schedule_result_queue.push(schedule_result);
    }

    private DequeueSubjects() {
        this.schedule_result.push(...this.schedule_result_queue);
        for (let i = 0; i < this.schedule_result_queue.length; i++) {
            const result = this.schedule_result_queue[i];
            const day_index = this.days.indexOf(result.day);
            const instructor_index = this.instructors.indexOf(result.instructor);
            this.rooms_allocation.push(`${result.room};${day_index};${result.time_start}`);
            this.rooms_allocation.push(`${result.room};${day_index};${result.time_end}`);
            this.instructors_allocation.push(`${instructor_index};${day_index};${result.time_start}`);
            this.instructors_allocation.push(`${instructor_index};${day_index};${result.time_end}`);
            this.section_allocation.push(`${this.current_section_allocation};${day_index};${result.time_start}`);
            this.section_allocation.push(`${this.current_section_allocation};${day_index};${result.time_end}`);
            if (result.subject.is_dividable) {
                const subsequent_day_index = day_index + this.subsequent_subject_day_interval;
                this.rooms_allocation.push(`${result.room};${subsequent_day_index};${result.time_start}`);
                this.rooms_allocation.push(`${result.room};${subsequent_day_index};${result.time_end}`);
                this.instructors_allocation.push(`${instructor_index};${subsequent_day_index};${result.time_start}`);
                this.instructors_allocation.push(`${instructor_index};${subsequent_day_index};${result.time_end}`);
                this.section_allocation.push(`${this.current_section_allocation};${subsequent_day_index};${result.time_start}`);
                this.section_allocation.push(`${this.current_section_allocation};${subsequent_day_index};${result.time_end}`);
            }
            if (this.instructors[instructor_index].load == null) {
                this.instructors[instructor_index].load = 0;
            }
            this.instructors[instructor_index].load += result.subject.total_hours;

        }
    }

    private RemoveSubjects(schedule_result_dequeue: Array<IScheduleBufferType>) {
        this.schedule_result = this.schedule_result.filter(x => !schedule_result_dequeue.includes(x));
        for (let i = 0; i < schedule_result_dequeue.length; i++) {
            const result = schedule_result_dequeue[i];
            const day_index = this.days.indexOf(result.day);
            const instructor_index = this.instructors.indexOf(result.instructor);

            let rooms_to_remove = [];
            let instructors_to_remove = [];
            let schedule_to_remove = [];
            rooms_to_remove.push(`${result.room};${day_index};${result.time_start}`);
            rooms_to_remove.push(`${result.room};${day_index};${result.time_end}`);
            instructors_to_remove.push(`${instructor_index};${day_index};${result.time_start}`);
            instructors_to_remove.push(`${instructor_index};${day_index};${result.time_end}`);
            schedule_to_remove.push(`${this.current_section_allocation};${day_index};${result.time_start}`);
            schedule_to_remove.push(`${this.current_section_allocation};${day_index};${result.time_end}`);
            if (result.subject.is_dividable) {
                const subsequent_day_index = day_index + this.subsequent_subject_day_interval;

                rooms_to_remove.push(`${result.room};${subsequent_day_index};${result.time_start}`)
                rooms_to_remove.push(`${result.room};${subsequent_day_index};${result.time_end}`)
                instructors_to_remove.push(`${instructor_index};${subsequent_day_index};${result.time_start}`);
                instructors_to_remove.push(`${instructor_index};${subsequent_day_index};${result.time_end}`);
                schedule_to_remove.push(`${this.current_section_allocation};${subsequent_day_index};${result.time_start}`);
                schedule_to_remove.push(`${this.current_section_allocation};${subsequent_day_index};${result.time_end}`);
            }
            this.rooms_allocation = this.rooms_allocation.filter(x => !rooms_to_remove.includes(x));
            this.instructors_allocation = this.instructors_allocation.filter(x => !instructors_to_remove.includes(x));
            this.section_allocation = this.section_allocation.filter(x => !schedule_to_remove.includes(x));
            if (this.instructors[instructor_index].load == null) {
                this.instructors[instructor_index].load = 0;
            }
            this.instructors[instructor_index].load -= result.subject.total_hours;
        }
    }


    private VerifyTotalAvailability() {
        //checks availability with the proposed time_start and time_end
        const current_instructor_details = this.instructors[this.current_instructor];
        const check_availability_room = CheckAvailability(this.rooms_allocation, this.current_room, this.current_time_start, this.current_time_end, this.current_day);
        const check_availability_instructor = CheckAvailability(this.instructors_allocation, this.current_instructor, this.current_time_start, this.current_time_end, this.current_day);
        const check_availability_instructor_schedule = CheckInstructorTimeAvailability(current_instructor_details, this.current_time_start, this.current_time_end, this.current_day);
        const check_availability_schedule = CheckAvailability(this.section_allocation, this.current_section_allocation, this.current_time_start, this.current_time_end, this.current_day);
        if (this.current_is_partitionable) {
            //if partitionable also checks for the subsequent schedule 

            const check_availability_subsequent_room = CheckAvailability(this.rooms_allocation, this.current_room, this.current_time_start, this.current_time_end, this.current_subsequent_day);
            const check_availability_subsequent_instructor = CheckAvailability(this.instructors_allocation, this.current_instructor, this.current_time_start, this.current_time_end, this.current_subsequent_day);
            const check_availability_subsequent_instructor_schedule = CheckInstructorTimeAvailability(current_instructor_details, this.current_time_start, this.current_time_end, this.current_subsequent_day);
            const check_availability_subsequent__schedule = CheckAvailability(this.section_allocation, this.current_section_allocation, this.current_time_start, this.current_time_end, this.current_subsequent_day);

            return (check_availability_room || check_availability_instructor || check_availability_instructor_schedule || check_availability_subsequent_room || check_availability_subsequent_instructor || check_availability_subsequent_instructor_schedule || check_availability_schedule || check_availability_subsequent__schedule)
        }
        else {
            return (check_availability_room || check_availability_instructor || check_availability_instructor_schedule || check_availability_schedule);
        }
    }

    private CheckSubjectsAvailability() {
        this.SetInstructors();
        this.current_is_partitionable = this.current_subject.is_dividable;
        const current_allocation = ConvertHourToValue((this.current_is_partitionable) ? (this.current_subject.total_hours / 2) : this.current_subject.total_hours);

        this.current_time_start = this.time_start;
        this.current_time_end = AddTime(this.time_start, current_allocation);
        this.current_subsequent_day = GetPrecedingDay(this.current_day, this.subsequent_subject_day_interval);

        let limit = 0;
        let week_allocation_buffer: Array<WeekType> = [];


        this.current_week_buffer = [];


        let is_not_available = this.VerifyTotalAvailability();

        while (is_not_available) {
            limit++;
            if (limit >= 1000) {
                console.log("ENDED AT: course:[" + this.current_course.code + "] section:[" + this.current_section +
                    "] subject:[" + this.current_subject.code + "] time_start:[" + this.current_time_start + "] time_end:[" + this.current_time_end,
                    "] day:[" + this.current_day + (this.current_is_partitionable && "] subsequent:[" + this.current_subsequent_day) +
                    "] instructor:[" + this.instructors[this.current_instructor].first_name + "] room:[" + this.rooms[this.current_room] +
                    "]"


                );
                console.log("max loop reached");
                return false;
            }
            const day_index = this.days.indexOf(this.current_day);
            if (this.current_session[day_index] > this.max_session && this.use_session) {
                this.current_time_start = this.time_start;
                this.current_time_end = AddTime(this.time_start, current_allocation);
                this.current_day = GetPrecedingDay(this.current_day, 1);
                this.current_subsequent_day = GetPrecedingDay(this.current_day, this.subsequent_subject_day_interval);
                // this.current_session[day_index] = 0;
            }
            this.current_time_start = AddTime(this.current_time_start, 30);
            this.current_time_end = AddTime(this.current_time_end, 30);

            const current_time_start_value = ConvertTimeToValue(this.current_time_start);
            const current_time_end_value = ConvertTimeToValue(this.current_time_end);

            //skips the proposed time_start and time_end if it overlaps in break time
            if ((current_time_start_value >= this.break_time_start && current_time_start_value < this.break_time_end) ||
                (current_time_end_value >= this.break_time_end && current_time_end_value < this.break_time_end)) {
                continue;
            }
            else if (current_time_start_value < this.break_time_start && current_time_end_value >= this.break_time_start) {
                continue;
            }

            if (this.current_is_partitionable && (this.days.indexOf(this.current_day) > 2)) {

                this.current_day = "monday";
                this.current_subsequent_day = GetPrecedingDay(this.current_day, this.subsequent_subject_day_interval);
                if (week_allocation_buffer.includes("monday") && week_allocation_buffer.includes("tuesday") && week_allocation_buffer.includes("wednesday")) {
                    week_allocation_buffer = [];
                    if (this.SwitchInstructors(this.current_instructor)) {
                        console.log("no available slots");
                        console.log(this.current_subject);
                        if (this.SwitchRooms()) {
                            return false;
                        }
                    }
                }
            }
            is_not_available = this.VerifyTotalAvailability();
            //skips the proposed time_start and time_end if it goes beyond time end of the day and proceeds to the next following day
            if (current_time_end_value > ConvertTimeToValue(this.time_end)) {
                this.current_time_start = this.time_start;
                this.current_time_end = AddTime(this.time_start, current_allocation);
                week_allocation_buffer.push(this.current_day);
                this.current_day = GetPrecedingDay(this.current_day, 1);
                this.current_subsequent_day = GetPrecedingDay(this.current_day, this.subsequent_subject_day_interval);

                if (ArraysMatch(week_allocation_buffer, this.days)) {
                    //switch / no available slots
                    //work hours per week of instructors
                    week_allocation_buffer = [];
                    const temp = this.current_instructor;
                    if (this.SwitchInstructors(this.current_instructor)) {
                        console.log("no available slots");
                        // return false;
                        console.log(this.current_subject);
                        if (this.SwitchRooms()) {
                            return false;
                        }

                    }
                    console.log("switched instructors from:" + temp + " to:" + this.current_instructor);
                }



                // console.log("switche day from:" + temp_day + "to:" + this.current_day);
                continue;
            }
        }
        // this.current_session += current_allocation;


        const day_index = this.days.indexOf(this.current_day);
        this.current_session[day_index] += (current_allocation / 60);
        // console.log(this.current_session);
        return true;
    }
    private SwitchInstructors(cur: number) {
        const fewest_load = Math.min(...this.instructors.map(x => x.load || 0));
        const instructors_available = this.instructors.filter((_, i) => i != cur);
        for (let i = 0; i < instructors_available.length; i++) {
            const preffered_subjects = instructors_available[i].preffered_subjects.map(x => x.code);

            if (preffered_subjects.includes(this.current_subject.code)) {
                this.current_instructor = this.instructors.indexOf(instructors_available[i]);
                return false;
            }
        }
        for (let i = 0; i < this.instructors.length; i++) {
            if (this.instructors[i].load == fewest_load && cur != i && !this.current_week_buffer.includes(i)) {


                this.current_instructor = i;
                break;
            }

        }

        if (this.instructors[cur + 1] != null && !this.current_week_buffer.includes(cur + 1)) {
            this.current_instructor = cur + 1;
            this.current_week_buffer.push(cur);
        }
        else if (!this.current_week_buffer.includes(0)) {
            this.current_instructor = 0;
            this.current_week_buffer.push(0);

        }

        return this.current_instructor == cur;


    }

    private SetInstructors() {
        // selects instructor and prioritizes with the preffered subject else the fewest load
        const fewest_load = Math.min(...this.instructors.map(x => x.load || 0));
        const instructors_available = this.instructors;

        // const instructors_available = this.instructors.filter(x => x.load || 0);

        for (let i = 0; i < instructors_available.length; i++) {
            const preffered_subjects = instructors_available[i].preffered_subjects.map(x => x.code);

            if (preffered_subjects.includes(this.current_subject.code)) {
                this.current_instructor = this.instructors.indexOf(instructors_available[i]);
                return;
            }
        }
        for (let i = 0; i < this.instructors.length; i++) {
            if (this.instructors[i].load == fewest_load) {
                this.current_instructor = i;
            }
        }

    }
    private SwitchRooms() {

        if ((this.rooms[this.current_room + 1]) != null) {
            this.current_room++;
            return false;
        }
        else {
            return true;
        }
    }

    private SetRooms() {
        console.log("called");
        let current_hours_occupied = 0;
        for (let i = 0; i < this.current_subjects.length; i++) {
            if ((this.current_subjects[i] as Subject).total_hours == undefined) {
                const subject = this.current_subjects[i] as SubjectHasLabLec;
                current_hours_occupied += subject.lec_total_hours;
            }
            else {
                const subject = this.current_subjects[i] as Subject
                current_hours_occupied += subject.total_hours;
            }
        }

        const room_sessions_available = CheckRoomTimeAvailability(this.rooms_allocation, this.current_room, this.time_start, this.time_end, this.break_time_start, this.break_time_end, this.days.length, this.max_session, this.use_session);
        const subjects_to_be_occupied = current_hours_occupied;


        console.log("available time for room:" + room_sessions_available);
        console.log(this.current_section + " occupies:" + subjects_to_be_occupied);
        //am pm? 
        //rotate / calcluate available time of the room and check if the will amount of hours of the sections would be able to occupy it
        if (subjects_to_be_occupied > room_sessions_available) {
            const temp = this.current_room;
            this.current_room++;
            console.log("Switched from "+temp+" to"+this.current_room);
        }

    }

    private CheckSubjectValidity(subject_index: number) {
        const current_subject_is_leclab = CheckSubjectIsLecLab(this.current_subjects[subject_index]);
        this.schedule_result_queue = [];
        let valid_schedule_results: Array<IScheduleBufferType> = [];
        if (current_subject_is_leclab) {
            const current = this.current_subjects[subject_index] as SubjectHasLabLec;

            const current_lab: Subject = {
                title: current.title,
                code: current.code,
                total_hours: current.lab_total_hours,
                is_dividable: current.lab_is_dividable
            }
            const current_lec: Subject = {
                ...current_lab,
                total_hours: current.lec_total_hours,
                is_dividable: current.lec_is_dividable
            }

            this.current_subject = current_lec;
            //lecture preperation


            if (!this.CheckSubjectsAvailability()) {
                return false;
            }

            this.EnqueueSubjects();   //set result queue for lecture
            this.DequeueSubjects(); // temporarily add queue

            valid_schedule_results.push(...this.schedule_result_queue);
            this.schedule_result_queue = [];


            const section_room = this.current_room;
            this.current_room = this.current_room_lab;
            this.current_subject = current_lab;

            if (!this.CheckSubjectsAvailability()) {

                console.log("backtracked");
                this.current_room = section_room;

                return false;
            }
            this.RemoveSubjects(valid_schedule_results);
            this.EnqueueSubjects();
            valid_schedule_results.push(...this.schedule_result_queue);
            this.current_room = section_room;

        }


        else {
            const current = this.current_subjects[subject_index] as Subject;
            this.current_subject = current;
            if (!this.CheckSubjectsAvailability()) {
                console.log("backtracked");
                return false;
            }
            this.EnqueueSubjects();
            valid_schedule_results.push(...this.schedule_result_queue);
        }
        this.schedule_result_queue = valid_schedule_results;
        return true;

    }
    //temporary displaying of data
    private PrintResults() {
        for (let i = 0; i < this.schedule_result.length; i++) {
            const result = this.schedule_result[i];
            const day_index = this.days.indexOf(result.day);
            console.log(result.course.code + ":" + result.section + "[" + result.subject.code + "]" + result.time_start + "-" + result.time_end + ":" + result.day + " Available" + " Room[" + this.rooms[result.room] + "]" + result.instructor.first_name);
            if (result.subject.is_dividable) {
                const subsequent_day_index = day_index + this.subsequent_subject_day_interval;
                console.log(result.course.code + ":" + result.section + "[" + result.subject.code + "]" + result.time_start + "-" + result.time_end + ":" + this.days[subsequent_day_index] + " Available" + " Room[" + this.rooms[result.room] + "]" + result.instructor.first_name);
            }

        }
        console.log("SUCCESS");
    }


    private SetSubjects(current_path: Array<number>, iterate: number) {
        if (iterate >= this.current_subjects.length) {
            return true;
        }

        const path_available_list = this.current_subjects.filter((_, i) => !current_path.includes(i));

        for (let i = 0; i < path_available_list.length; i++) {
            const subject_index = this.current_subjects.indexOf(path_available_list[i]);
            current_path.push(subject_index);
            if (this.CheckSubjectValidity(subject_index)) {
                const temp_queue = this.schedule_result_queue;
                this.DequeueSubjects(); //add
                console.log("ADDED: course:[" + this.current_course.code + "] section:[" + this.current_section +
                    "] subject:[" + this.current_subject.code + "] time_start:[" + this.current_time_start + "] time_end:[" + this.current_time_end,
                    "] day:[" + this.current_day + (this.current_is_partitionable ? "] subsequent:[" + this.current_subsequent_day : "") +
                    "] instructor:[" + this.instructors[this.current_instructor].first_name + "] room:[" + this.rooms[this.current_room] +
                    "]"


                );
                if (this.SetSubjects(current_path, iterate + 1)) {

                    return true;
                }
                // console.log("removed");
                console.log("REMOVED: course:[" + this.current_course.code + "] section:[" + this.current_section +
                    "] subject:[" + this.current_subject.code + "] time_start:[" + this.current_time_start + "] time_end:[" + this.current_time_end,
                    "] day:[" + this.current_day + (this.current_is_partitionable ? "] subsequent:[" + this.current_subsequent_day : "") +
                    "] instructor:[" + this.instructors[this.current_instructor].first_name + "] room:[" + this.rooms[this.current_room] +
                    "]"


                );
                this.RemoveSubjects(temp_queue); // remove
                //remove
            }


        }

        return false;
        // if // loop between choices of subjects
    }

    private SetSections(sections_amount: number) {

        for (let i = 1; i <= sections_amount; i++) {
            const section_name = (this.current_year + String.fromCharCode(96 + i)).toUpperCase();
            this.current_section_allocation++;
            this.current_day = "monday";
            this.current_session = [0, 0, 0, 0, 0, 0];
            this.current_section = section_name;
            
            this.SetRooms();
            if (!this.SetSubjects([], 0)) {
                console.log("backtracked");
                return false;
            }
            // if (!this.SetSubjects(0)) {

            //     console.log("backtracked");
            //     return false;
            // }
        }
        return true;
    }
    private OptimizeRaw() {
        let optimizedData: Array<IScheduleBufferType> = [];

        for (let i = 0; i < this.schedule_result.length; i++) {
            const result = this.schedule_result[i];
            const day_index = this.days.indexOf(result.day);
            if (result.subject.total_hours == 0) {
                continue;
            }
            optimizedData.push(result);
            if (result.subject.is_dividable) {

                const subsequent_day_index = day_index + 3;
                optimizedData.push({ ...result, day: this.days[subsequent_day_index] });
            }
        }
        this.schedule_result = optimizedData;
    }

    public async Solve() {

        if (!CheckInputsEligibility(this.inputs)) {
            return false;
        }
        console.log("::::::::::STARTED:::::::::");
        for (let i = 0; i < this.courses.length; i++) {
            this.current_course = this.courses[i];
            for (let year = 1; year <= 4; year++) {
                this.current_year = year as YearType;
                const current = this.data.find(x => x.year == this.current_year && x.course == this.current_course.code);
                if (current == undefined) {
                    continue;
                }
                this.current_subjects = current.subjects;
                if (!this.SetSections(current.sections)) {
                    console.log(":::::::::::ENDED:::::::::::");

                    console.log(this.rooms_allocation);
                    console.log(this.instructors);
                    console.log(this.schedule_result);
                    return false;
                }
            }
        }
        console.log(":::::::::::ENDED:::::::::::");
        this.OptimizeRaw();
        console.log(this.rooms_allocation);
        console.log(this.instructors);
        console.log(this.schedule_result);
        this.PrintResults();




        const result_response: ISchedulingResultType = {
            result: this.schedule_result,
            instructors: this.instructors,
            rooms: this.rooms,
        }
        return result_response;
    }

}

