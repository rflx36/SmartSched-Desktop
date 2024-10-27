import { ICSP, IScheduleBufferType, ISchedulingResultType, TimeAllocationBufferType } from "../types/core_types";
import { CourseType, Subject, SubjectHasLabLec, TimeType, WeekType, YearType } from "../types/types";
import ArraysMatch from "./utils/array_match";
import CheckAvailability from "./utils/check_availability";
import CheckInputsEligibility from "./utils/check_inputs_eligibility";
import CheckInstructorTimeAvailability from "./utils/check_instructor_time_availability";
import CheckRoomTimeAvailability from "./utils/check_room_time_availability";
import CheckSubjectIsLecLab from "./utils/check_subject_type";
import { ConvertHourToValue, ConvertTimeToValue, ConvertValueToTime } from "./utils/time_converter";
import { AddTime, GetPrecedingDay } from "./utils/time_modifier";






export default async function SchedulingCSPFunctionBased(inputs: ICSP) {
    let data = inputs.data;
    let instructors = inputs.instructors;
    let courses = inputs.courses;
    let rooms = inputs.rooms.concat(inputs.rooms_lab);
    // let rooms_lab_amount = inputs.rooms_lab.length;
    let time_start = inputs.time_start;
    let time_end = inputs.time_end;
    let break_time_start = ConvertTimeToValue(inputs.break_time_start);
    let break_time_end = ConvertTimeToValue(inputs.break_time_end);
    let current_room_lab = inputs.rooms.length;



    const days: Array<WeekType> = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const subsequent_subject_day_interval = 3;
    const max_session = 4; // amount of hours for the day
    const use_session = true;

    let rooms_allocation: Array<TimeAllocationBufferType> = [];
    let instructors_allocation: Array<TimeAllocationBufferType> = [];
    let schedule_result_queue: Array<IScheduleBufferType> = [];
    let schedule_result: Array<IScheduleBufferType> = [];
    let current_room: number = 0;
    let current_time_start: TimeType = "00:00";
    let current_time_end: TimeType = "00:00";
    let current_instructor: number = 0;
    let current_subjects: Array<Subject | SubjectHasLabLec> = [];
    let current_subject: Subject = { title: "", code: "", total_hours: 0, is_dividable: false };
    let current_session: Array<number> = [0, 0, 0, 0, 0, 0];
    let current_section: string = "";
    let current_course: CourseType = { name: "", code: "" };
    let current_year: YearType = 1;
    let current_day: WeekType = "monday";
    let current_subsequent_day: WeekType = "thursday";
    let current_is_partitionable: boolean = false;
    let current_week_buffer: Array<number> = [];





    const EnqueueSubjects = () => {
        const current_time_end_value = ConvertTimeToValue(current_time_end);
        const modified_time_end_value = ConvertValueToTime(current_time_end_value - 1);
        const schedule_result: IScheduleBufferType = {
            course: current_course,
            room: current_room,
            section: current_section,
            subject: current_subject,
            time_start: current_time_start,
            time_end: modified_time_end_value,
            day: current_day,
            instructor: instructors[current_instructor]
        }
        schedule_result_queue.push(schedule_result);
    }

    const DequeueSubjects = () => {
        schedule_result.push(...schedule_result_queue);
        for (let i = 0; i < schedule_result_queue.length; i++) {
            const result = schedule_result_queue[i];
            const day_index = days.indexOf(result.day);
            const instructor_index = instructors.indexOf(result.instructor);
            rooms_allocation.push(`${result.room};${day_index};${result.time_start}`);
            rooms_allocation.push(`${result.room};${day_index};${result.time_end}`);
            instructors_allocation.push(`${instructor_index};${day_index};${result.time_start}`);
            instructors_allocation.push(`${instructor_index};${day_index};${result.time_end}`);
            if (result.subject.is_dividable) {
                const subsequent_day_index = day_index + subsequent_subject_day_interval;
                rooms_allocation.push(`${result.room};${subsequent_day_index};${result.time_start}`);
                rooms_allocation.push(`${result.room};${subsequent_day_index};${result.time_end}`);
                instructors_allocation.push(`${instructor_index};${subsequent_day_index};${result.time_start}`);
                instructors_allocation.push(`${instructor_index};${subsequent_day_index};${result.time_end}`);
            }
            if (instructors[instructor_index].load == null) {
                instructors[instructor_index].load = 0;
            }
            instructors[instructor_index].load += result.subject.total_hours;

        }
    }

    const RemoveSubjects = (schedule_result_dequeue: Array<IScheduleBufferType>) => {
        schedule_result = schedule_result.filter(x => !schedule_result_dequeue.includes(x));
        for (let i = 0; i < schedule_result_dequeue.length; i++) {
            const result = schedule_result_dequeue[i];
            const day_index = days.indexOf(result.day);
            const instructor_index = instructors.indexOf(result.instructor);

            let rooms_to_remove = [];
            let instructors_to_remove = [];
            rooms_to_remove.push(`${result.room};${day_index};${result.time_start}`);
            rooms_to_remove.push(`${result.room};${day_index};${result.time_end}`);
            instructors_to_remove.push(`${instructor_index};${day_index};${result.time_start}`);
            instructors_to_remove.push(`${instructor_index};${day_index};${result.time_end}`);
            if (result.subject.is_dividable) {
                const subsequent_day_index = day_index + subsequent_subject_day_interval;

                rooms_to_remove.push(`${result.room};${subsequent_day_index};${result.time_start}`)
                rooms_to_remove.push(`${result.room};${subsequent_day_index};${result.time_end}`)
                instructors_to_remove.push(`${instructor_index};${subsequent_day_index};${result.time_start}`);
                instructors_to_remove.push(`${instructor_index};${subsequent_day_index};${result.time_end}`);
            }
            rooms_allocation = rooms_allocation.filter(x => !rooms_to_remove.includes(x));
            instructors_allocation = instructors_allocation.filter(x => !instructors_to_remove.includes(x));
            if (instructors[instructor_index].load == null) {
                instructors[instructor_index].load = 0;
            }
            instructors[instructor_index].load -= result.subject.total_hours;
        }
    }


    const VerifyTotalAvailability = () => {
        //checks availability with the proposed time_start and time_end
        const current_instructor_details = instructors[current_instructor];
        const check_availability_room = CheckAvailability(rooms_allocation, current_room, current_time_start, current_time_end, current_day);
        const check_availability_instructor = CheckAvailability(instructors_allocation, current_instructor, current_time_start, current_time_end, current_day);
        const check_availability_instructor_schedule = CheckInstructorTimeAvailability(current_instructor_details, current_time_start, current_time_end, current_day);
        if (current_is_partitionable) {
            //if partitionable also checks for the subsequent schedule 

            const check_availability_subsequent_room = CheckAvailability(rooms_allocation, current_room, current_time_start, current_time_end, current_subsequent_day);
            const check_availability_subsequent_instructor = CheckAvailability(instructors_allocation, current_instructor, current_time_start, current_time_end, current_subsequent_day);
            const check_availability_subsequent_instructor_schedule = CheckInstructorTimeAvailability(current_instructor_details, current_time_start, current_time_end, current_subsequent_day);

            return (check_availability_room || check_availability_instructor || check_availability_instructor_schedule || check_availability_subsequent_room || check_availability_subsequent_instructor || check_availability_subsequent_instructor_schedule)
        }
        else {
            return (check_availability_room || check_availability_instructor || check_availability_instructor_schedule);
        }
    }

    const CheckSubjectsAvailability = () => {
        SetInstructors();
        current_is_partitionable = current_subject.is_dividable;
        const current_allocation = ConvertHourToValue((current_is_partitionable) ? (current_subject.total_hours / 2) : current_subject.total_hours);

        current_time_start = time_start;
        current_time_end = AddTime(time_start, current_allocation);
        current_subsequent_day = GetPrecedingDay(current_day, subsequent_subject_day_interval);

        let limit = 0;
        let week_allocation_buffer: Array<WeekType> = [];


        current_week_buffer = [];


        let is_not_available = VerifyTotalAvailability();

        while (is_not_available) {
            limit++;
            if (limit >= 10000) {
                console.log("ENDED AT: course:[" + current_course.code + "] section:[" + current_section +
                    "] subject:[" + current_subject.code + "] time_start:[" + current_time_start + "] time_end:[" + current_time_end,
                    "] day:[" + current_day + (current_is_partitionable && "] subsequent:[" + current_subsequent_day) +
                    "] instructor:[" + instructors[current_instructor].first_name + "] room:[" + rooms[current_room] +
                    "]"


                );
                console.log("max loop reached");
                return false;
            }
            const day_index = days.indexOf(current_day);
            if (current_session[day_index] > max_session && use_session) {
                current_time_start = time_start;
                current_time_end = AddTime(time_start, current_allocation);
                current_day = GetPrecedingDay(current_day, 1);
                current_subsequent_day = GetPrecedingDay(current_day, subsequent_subject_day_interval);
                // current_session[day_index] = 0;
            }
            current_time_start = AddTime(current_time_start, 30);
            current_time_end = AddTime(current_time_end, 30);

            const current_time_start_value = ConvertTimeToValue(current_time_start);
            const current_time_end_value = ConvertTimeToValue(current_time_end);

            //skips the proposed time_start and time_end if it overlaps in break time
            if ((current_time_start_value >= break_time_start && current_time_start_value < break_time_end) ||
                (current_time_end_value >= break_time_end && current_time_end_value < break_time_end)) {
                continue;
            }
            else if (current_time_start_value < break_time_start && current_time_end_value >= break_time_start) {
                continue;
            }

            is_not_available = VerifyTotalAvailability();

            //skips the proposed time_start and time_end if it goes beyond time end of the day and proceeds to the next following day
            if (current_time_end_value > ConvertTimeToValue(time_end)) {
                current_time_start = time_start;
                current_time_end = AddTime(time_start, current_allocation);
                // const temp_day = current_day;
                week_allocation_buffer.push(current_day);
                current_day = GetPrecedingDay(current_day, 1);
                current_subsequent_day = GetPrecedingDay(current_day, subsequent_subject_day_interval);

                if (ArraysMatch(week_allocation_buffer, days)) {
                    //switch / no available slots
                    //work hours per week of instructors
                    week_allocation_buffer = [];
                    const temp = current_instructor;
                    if (SwitchInstructors(current_instructor)) {
                        console.log("no available slots");
                        // return false;
                        console.log(current_subject);
                        if (SwitchRooms()) {
                            return false;
                        }

                    }
                    console.log("switched instructors from:" + temp + " to:" + current_instructor);
                }



                // console.log("switche day from:" + temp_day + "to:" + current_day);
                continue;
            }
        }
        // current_session += current_allocation;


        const day_index = days.indexOf(current_day);
        current_session[day_index] += (current_allocation / 60);
        // console.log(current_session);
        return true;
    }
    const SwitchInstructors = (cur: number) => {
        const fewest_load = Math.min(...instructors.map(x => x.load || 0));
        const instructors_available = instructors.filter((_, i) => i != cur);
        for (let i = 0; i < instructors_available.length; i++) {
            const preffered_subjects = instructors_available[i].preffered_subjects.map(x => x.code);

            if (preffered_subjects.includes(current_subject.code)) {
                current_instructor = instructors.indexOf(instructors_available[i]);
                return false;
            }
        }
        for (let i = 0; i < instructors.length; i++) {
            if (instructors[i].load == fewest_load && cur != i && !current_week_buffer.includes(i)) {


                current_instructor = i;
                break;
            }

        }

        if (instructors[cur + 1] != null && !current_week_buffer.includes(cur + 1)) {
            current_instructor = cur + 1;
            current_week_buffer.push(cur);
        }
        else if (!current_week_buffer.includes(0)) {
            current_instructor = 0;
            current_week_buffer.push(0);

        }

        return current_instructor == cur;


    }

    const SetInstructors = () => {
        // selects instructor and prioritizes with the preffered subject else the fewest load
        const fewest_load = Math.min(...instructors.map(x => x.load || 0));
        const instructors_available = instructors;

        // const instructors_available = instructors.filter(x => x.load || 0);

        for (let i = 0; i < instructors_available.length; i++) {
            const preffered_subjects = instructors_available[i].preffered_subjects.map(x => x.code);

            if (preffered_subjects.includes(current_subject.code)) {
                current_instructor = instructors.indexOf(instructors_available[i]);
                return;
            }
        }
        for (let i = 0; i < instructors.length; i++) {
            if (instructors[i].load == fewest_load) {
                current_instructor = i;
            }
        }

    }
    const SwitchRooms = () => {

        if ((rooms[current_room + 1]) != null) {
            current_room++;
            return false;
        }
        else {
            return true;
        }
    }

    const SetRooms = () => {
        console.log("called");
        let current_hours_occupied = 0;
        for (let i = 0; i < current_subjects.length; i++) {
            if ((current_subjects[i] as Subject).total_hours == undefined) {
                const subject = current_subjects[i] as SubjectHasLabLec;
                current_hours_occupied += subject.lec_total_hours;
            }
            else {
                const subject = current_subjects[i] as Subject
                current_hours_occupied += subject.total_hours;
            }
        }

        const room_sessions_available = CheckRoomTimeAvailability(rooms_allocation, current_room, time_start, time_end, break_time_start, break_time_end, days.length, max_session, use_session);
        const subjects_to_be_occupied = current_hours_occupied;


        console.log("available time for room:" + room_sessions_available);
        console.log(current_section + " occupies:" + subjects_to_be_occupied);
        //am pm? 
        //rotate / calcluate available time of the room and check if the will amount of hours of the sections would be able to occupy it
        if (subjects_to_be_occupied > room_sessions_available) {
            current_room++;
        }

    }

    const CheckSubjectValidity = (subject_index: number) => {
        const current_subject_is_leclab = CheckSubjectIsLecLab(current_subjects[subject_index]);
        schedule_result_queue = [];
        let valid_schedule_results: Array<IScheduleBufferType> = [];
        if (current_subject_is_leclab) {
            const current = current_subjects[subject_index] as SubjectHasLabLec;

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

            current_subject = current_lec;
            //lecture preperation


            if (!CheckSubjectsAvailability()) {
                return false;
            }

            EnqueueSubjects();   //set result queue for lecture
            DequeueSubjects(); // temporarily add queue

            valid_schedule_results.push(...schedule_result_queue);
            schedule_result_queue = [];


            const section_room = current_room;
            current_room = current_room_lab;
            current_subject = current_lab;

            if (!CheckSubjectsAvailability()) {

                console.log("backtracked");
                current_room = section_room;

                return false;
            }
            RemoveSubjects(valid_schedule_results);
            EnqueueSubjects();
            valid_schedule_results.push(...schedule_result_queue);
            current_room = section_room;

        }


        else {
            const current = current_subjects[subject_index] as Subject;
            current_subject = current;
            if (!CheckSubjectsAvailability()) {
                console.log("backtracked");
                return false;
            }
            EnqueueSubjects();
            valid_schedule_results.push(...schedule_result_queue);
        }
        schedule_result_queue = valid_schedule_results;
        return true;

    }
    //temporary displaying of data
    const PrintResults = () => {
        for (let i = 0; i < schedule_result.length; i++) {
            const result = schedule_result[i];
            const day_index = days.indexOf(result.day);
            console.log(result.course.code + ":" + result.section + "[" + result.subject.code + "]" + result.time_start + "-" + result.time_end + ":" + result.day + " Available" + " Room[" + rooms[result.room] + "]" + result.instructor.first_name);
            if (result.subject.is_dividable) {
                const subsequent_day_index = day_index + subsequent_subject_day_interval;
                console.log(result.course.code + ":" + result.section + "[" + result.subject.code + "]" + result.time_start + "-" + result.time_end + ":" + days[subsequent_day_index] + " Available" + " Room[" + rooms[result.room] + "]" + result.instructor.first_name);
            }

        }
        console.log("SUCCESS");
    }


    const SetSubjects = (current_path: Array<number>, iterate: number) => {
        if (iterate >= current_subjects.length) {
            return true;
        }

        const path_available_list = current_subjects.filter((_, i) => !current_path.includes(i));

        for (let i = 0; i < path_available_list.length; i++) {
            const subject_index = current_subjects.indexOf(path_available_list[i]);
            current_path.push(subject_index);
            if (CheckSubjectValidity(subject_index)) {
                const temp_queue = schedule_result_queue;
                DequeueSubjects(); //add
                console.log("ADDED: course:[" + current_course.code + "] section:[" + current_section +
                    "] subject:[" + current_subject.code + "] time_start:[" + current_time_start + "] time_end:[" + current_time_end,
                    "] day:[" + current_day + (current_is_partitionable ? "] subsequent:[" + current_subsequent_day : "") +
                    "] instructor:[" + instructors[current_instructor].first_name + "] room:[" + rooms[current_room] +
                    "]"


                );
                if (SetSubjects(current_path, iterate + 1)) {

                    return true;
                }
                // console.log("removed");
                console.log("REMOVED: course:[" + current_course.code + "] section:[" + current_section +
                    "] subject:[" + current_subject.code + "] time_start:[" + current_time_start + "] time_end:[" + current_time_end,
                    "] day:[" + current_day + (current_is_partitionable ? "] subsequent:[" + current_subsequent_day : "") +
                    "] instructor:[" + instructors[current_instructor].first_name + "] room:[" + rooms[current_room] +
                    "]"


                );
                RemoveSubjects(temp_queue); // remove
                //remove
            }


        }

        return false;
        // if // loop between choices of subjects
    }

    const SetSections = (sections_amount: number) => {

        for (let i = 1; i <= sections_amount; i++) {
            const section_name = (current_year + String.fromCharCode(96 + i)).toUpperCase();

            current_day = "monday";
            current_session = [0, 0, 0, 0, 0, 0];
            current_section = section_name;
            SetRooms();
            if (!SetSubjects([], 0)) {
                console.log("backtracked");
                return false;
            }
            // if (!SetSubjects(0)) {

            //     console.log("backtracked");
            //     return false;
            // }
        }
        return true;
    }
    const Solve = async () => {

        if (!CheckInputsEligibility(inputs)) {
            return false;
        }
        console.log("::::::::::STARTED:::::::::");
        for (let i = 0; i < courses.length; i++) {
            current_course = courses[i];
            for (let year = 1; year <= 4; year++) {
                current_year = year as YearType;
                const current = data.find(x => x.year == current_year && x.course == current_course.code);
                if (current == undefined) {
                    continue;
                }
                current_subjects = current.subjects;
                if (!SetSections(current.sections)) {

                    console.log(rooms_allocation);
                    console.log(instructors);
                    console.log(schedule_result);
                    console.log(":::::::::::ENDED:::::::::::");

                    return false;
                }
            }
        }
        console.log(":::::::::::ENDED:::::::::::");

        console.log(rooms_allocation);
        console.log(instructors);
        console.log(schedule_result);
        PrintResults();




        const result_response: ISchedulingResultType = {
            result: schedule_result,
            instructors_time_allocation: instructors,
            rooms_time_allocation: rooms_allocation,
            rooms: rooms,
        }
        return result_response;
    }

    return Solve();



}