import { ICSP } from "../../types/core_types";
import { Subject, SubjectHasLabLec, YearType } from "../../types/types";
import { ConvertTimeToValue } from "./time_converter";

export default function CheckInputsEligibility(inputs: ICSP) {
    const days_available = 6;
    const instructors = inputs.instructors.length;
    const time_start = inputs.time_start;
    const time_end = inputs.time_end;
    const break_time_start = inputs.break_time_start;
    const break_time_end = inputs.break_time_end;
    const rooms_amount = inputs.rooms.length;
    const courses_amount = inputs.courses.length;

    const time_start_value = ConvertTimeToValue(time_start);
    const time_end_value = ConvertTimeToValue(time_end);
    const break_time_start_value = ConvertTimeToValue(break_time_start);
    const break_time_end_value = ConvertTimeToValue(break_time_end);
    const room_total_time_value_available = ((time_end_value - time_start_value) - (break_time_end_value - break_time_start_value)) * rooms_amount * days_available;
    const room_total_time_available = room_total_time_value_available / 60;
    let total_subjects = 0;
    let room_hours_occupied = 0;
    let is_eligible = false;

    for (let i = 0; i < courses_amount; i++) {

        if (instructors == 0) {

            break;
        }
        const current_course = inputs.courses[i];
        for (let j = 1; j <= 4; j++) {
            const current_year = j as YearType;
            const current = inputs.data.find(x => x.year == current_year && x.course == current_course.code);
            if (current == undefined) {
                continue;
            }

            let current_hours_occupied = 0;
            let current_total_subjects = 0;
            for (let k = 0; k < current.subjects.length; k++) {
                if ((current.subjects[k] as Subject).total_hours == undefined) {
                    const subject = current.subjects[k] as SubjectHasLabLec
                    current_hours_occupied += subject.lab_total_hours + subject.lec_total_hours;
                }
                else {
                    const subject = current.subjects[k] as Subject;
                    current_hours_occupied += subject.total_hours;
                }
                current_total_subjects++;
            }
            total_subjects += current_total_subjects * current.sections;
            room_hours_occupied += current_hours_occupied * current.sections;
        }
    }
    let total_instructors_time_available = 0;
    if (instructors != 0) {

        const ins = inputs.instructors;
        for (let i = 0; i < instructors; i++) {
            if (ins[i].monday) {
                const amount = ConvertTimeToValue(ins[i].monday!.time_end) - ConvertTimeToValue(ins[i].monday!.time_start);
                total_instructors_time_available += (amount / 60);
            }
            if (ins[i].tuesday) {
                const amount = ConvertTimeToValue(ins[i].tuesday!.time_end) - ConvertTimeToValue(ins[i].tuesday!.time_start);
                total_instructors_time_available += (amount / 60);
            }
            if (ins[i].wednesday) {
                const amount = ConvertTimeToValue(ins[i].wednesday!.time_end) - ConvertTimeToValue(ins[i].wednesday!.time_start);
                total_instructors_time_available += (amount / 60);
            }
            if (ins[i].thursday) {
                const amount = ConvertTimeToValue(ins[i].thursday!.time_end) - ConvertTimeToValue(ins[i].thursday!.time_start);
                total_instructors_time_available += (amount / 60);
            }
            if (ins[i].friday) {
                const amount = ConvertTimeToValue(ins[i].friday!.time_end) - ConvertTimeToValue(ins[i].friday!.time_start);
                total_instructors_time_available += (amount / 60);
            }
            if (ins[i].saturday) {
                const amount = ConvertTimeToValue(ins[i].saturday!.time_end) - ConvertTimeToValue(ins[i].saturday!.time_start);
                total_instructors_time_available += (amount / 60);
            }
        }

        is_eligible = !(room_total_time_available < room_hours_occupied || total_instructors_time_available < room_hours_occupied);
    }
    // console.log("Amount of Hours Available: " + (room_total_time_value_available / 60));
    // console.log("Amount of Hours Occupied: " + room_hours_occupied);
    // console.log("Amount of Available Subjects to be assigned: " + total_subjects);

    const response = {
        is_eligible: is_eligible,
        room_hours_available: (room_total_time_value_available / 60),
        subject_hours_occupied: room_hours_occupied,
        instructor_hours_available: total_instructors_time_available,
        subjects_available: total_subjects
    }
    return response;
}