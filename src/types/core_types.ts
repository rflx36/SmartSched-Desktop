import { CourseType, CurrentSemester, InstructorType, Subject, SubjectHasLabLec, TimeAvailabilityType, TimeType, WeekType, YearType } from "../types/types";

export interface ICSP {
    instructors: Array<InstructorType>,
    data: Array<CurrentSemester>
    time_start: TimeType,
    time_end: TimeType,
    break_time_start: TimeType,
    break_time_end: TimeType,
    courses: Array<CourseType>
    rooms: Array<string>,
    rooms_lab: Array<string>
}


export type TimeAllocationBufferType = `${number};${number};${TimeType}`;

export interface IPendingSubsequentSubjectDayInterval {
    day: WeekType,
    subject: Subject | SubjectHasLabLec
}

export interface IScheduleBufferType {
    course: CourseType,
    room: number,

    section: string,
    subject: Subject,
    time_start: TimeType,
    time_end: TimeType,
    day: WeekType,
    instructor: InstructorType
}


export interface ISchedulingResultType {
    result: Array<IScheduleBufferType>,
    instructors: Array<InstructorType>,
    rooms: Array<string>,
}


export interface RoomSessionSchedule {
    time_start: TimeType,
    time_end: TimeType
    duration: number,
    section: string,
    year: YearType,
    course: {
        code: string,
        title: string
    }
    instructor: {
        first_name: string,
        last_name: string
    }
    subject: {
        code: string,
        title: string
    }
}
export interface InstructorSessionSchedule {
    time_start: TimeType,
    time_end: TimeType,
    duration: number,
    section: string,
    year: YearType,
    course: {
        code: string,
        title: string
    }
    room: string,
    subject: {
        code: string,
        title: string
    }
}

export interface YearSessionSchedule {
    time_start: TimeType,
    time_end: TimeType,
    duration: number,
    section: string,
    course: {
        code: string,
        title: string
    },
    room: string,
    instructor: {
        first_name: string,
        last_name: string
    },
    subject: {
        code: string,
        title: string
    }
}


export interface RoomFiltered {
    room_name: string,
    monday_schedule?: Array<RoomSessionSchedule>,
    tuesday_schedule?: Array<RoomSessionSchedule>,
    wednesday_schedule?: Array<RoomSessionSchedule>,
    thursday_schedule?: Array<RoomSessionSchedule>,
    friday_schedule?: Array<RoomSessionSchedule>,
    saturday_schedule?: Array<RoomSessionSchedule>

}




export interface InstructorFiltered {
    instructor: {
        first_name: string,
        last_name: string
    }
    monday_schedule?: Array<InstructorSessionSchedule>,
    tuesday_schedule?: Array<InstructorSessionSchedule>,
    wednesday_schedule?: Array<InstructorSessionSchedule>,
    thursday_schedule?: Array<InstructorSessionSchedule>,
    friday_schedule?: Array<InstructorSessionSchedule>,
    saturday_schedule?: Array<InstructorSessionSchedule>,
}



export interface YearFiltered {
    year: YearType,
    monday_schedule?: Array<YearSessionSchedule>,
    tuesday_schedule?: Array<YearSessionSchedule>,
    wednesday_schedule?: Array<YearSessionSchedule>,
    thursday_schedule?: Array<YearSessionSchedule>,
    friday_schedule?: Array<YearSessionSchedule>,
    saturday_schedule?: Array<YearSessionSchedule>,
}


export interface DataFiltered {
    filter: string,
    monday_schedule?: Array<InstructorSessionSchedule | RoomSessionSchedule | YearSessionSchedule>,
    tuesday_schedule?: Array<InstructorSessionSchedule | RoomSessionSchedule | YearSessionSchedule>,
    wednesday_schedule?: Array<InstructorSessionSchedule | RoomSessionSchedule | YearSessionSchedule>,
    thursday_schedule?: Array<InstructorSessionSchedule | RoomSessionSchedule | YearSessionSchedule>,
    friday_schedule?: Array<InstructorSessionSchedule | RoomSessionSchedule | YearSessionSchedule>,
    saturday_schedule?: Array<InstructorSessionSchedule | RoomSessionSchedule | YearSessionSchedule>,
    availibility?: AvailabilityFiltered
}



interface AvailabilityFiltered {
    monday_schedule?: TimeAvailabilityType,
    tuesday_schedule?: TimeAvailabilityType,
    wednesday_schedule?: TimeAvailabilityType,
    thursday_schedule?: TimeAvailabilityType,
    friday_schedule?: TimeAvailabilityType,
    saturday_schedule?: TimeAvailabilityType,
}