import { DataFiltered, IScheduleBufferType } from "./core_types";

type h = "00" | '01' | '02' | '03' | '04' | '05'
    | '06' | '07' | '08' | '09' | '10' | '11' | '12'
    | '13' | '14' | '15' | '16' | '17' | '18' | '19'
    | '20' | '21' | '22' | '23' | '24';

type m = h | '25' | '26' | '27' | '28' | '29' | '30'
    | '31' | '32' | '33' | '34' | '35' | '36' | '37' | '38' | '39' | '40'
    | '41' | '42' | '43' | '44' | '45' | '46' | '47' | '48' | '49' | '50'
    | '51' | '52' | '53' | '54' | '55' | '56' | '57' | '58' | '59' | '60';

export type TimeType = `${h}:${m}`;
export type YearType = 1 | 2 | 3 | 4;
export type SemesterType = "1st" | "2nd";
export type ModalsType = "rooms" | "courses" | "sections" | "instructors" | "closed" | "delete" | "schedule" | "upload auth" | "request" | "view listed schedule";
export type ModalsActionType = "confirmed" | "cancelled" | null;
export type WeekType = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
export type SidebarsType = "dashboard" | "schedules" | "setup" | "subjects" | "instructors";
export type ScheduleFilterType = "instructor" | "room" | "section";


export interface ViewListedScheduleType {
    room_name: string,
    is_available: boolean,
    allocated_list: Array<AllocatedListType>,
    time_display: string
}


export interface SessionSchedule {
    title: string,
    code: string,
    time_start: TimeType,
    time_end: TimeType,
    instructor: string,
    week: WeekType
}
export interface DaySchedule {
    year: YearType,
    section: string,
    subject_sessions: Array<SessionSchedule>,
    room: string
}


export interface Subject {
    title: string,
    code: string,
    total_hours: number,
    is_dividable: boolean,

}

export interface SubjectHasLabLec {
    title: string,
    code: string,
    lab_total_hours: number,
    lab_is_dividable: boolean,
    lec_total_hours: number,
    lec_is_dividable: boolean,

}

export interface CurrentSemester {
    year: YearType,
    subjects: Array<Subject | SubjectHasLabLec>,
    course: string,
    sections: number
}


export interface ClassSectionType {
    year_active: YearType,
    sem_active: SemesterType,
    course_active: string,
    data: Array<CurrentSemester>
}

export interface UIStateType {
    sidebar_active: SidebarsType,
    sidebar_setup_step: 0 | 1 | 2 | 3 | 4 | number;
    modal: ModalsType,
    modal_action: ModalsActionType,
    modal_message: string,
    modal_submessage: string,
    modal_edit_subjects: {
        subjects: Array<Subject | SubjectHasLabLec>,
        course: CourseType,
        sections: number,
    } | null,
    modal_edit_instructors: InstructorType | null,
    modal_upload_auth: MainScheduleType,
    modal_request: RequestTypes | null,
    modal_view_listed: ViewListedScheduleType | null,
    dropdown_course: string
}

export interface CourseType {
    name: string,
    code: string,
}
export interface ClassSessionType {
    time_start: TimeType,
    time_end: TimeType,
    courses: Array<CourseType>,
    rooms: Array<RoomType>,
    break_time_start: TimeType,
    break_time_end: TimeType
}

export interface TimeAvailabilityType {
    time_start: TimeType,
    time_end: TimeType,
}

export interface InstructorType {
    first_name: string,
    last_name: string,
    fulltime: boolean,
    preffered_subjects: Array<Subject | SubjectHasLabLec>,
    monday?: TimeAvailabilityType,
    tuesday?: TimeAvailabilityType,
    wednesday?: TimeAvailabilityType,
    thursday?: TimeAvailabilityType,
    friday?: TimeAvailabilityType,
    saturday?: TimeAvailabilityType,
    load?: number
    assigned_subjects?: Array<Subject | SubjectHasLabLec>
}

export interface ClassInstructorType {
    instructors: Array<InstructorType>
}


export interface RoomType {
    room_name: string,
    is_realtime: boolean,
    realtime_id?: string
}



export interface SubjectDetailType {
    description: string,
    code: string,
    hours_allocated: number,
    is_partitionable: boolean,
    type: "lecture" | "labaratory"
}


export interface ViewScheduleType {
    selected: string,
    data: DataFiltered,
    highlighted_id: string,
    filter_type: ScheduleFilterType,
    view_availability: boolean,
    time_start: TimeType,
    time_end: TimeType
}


export type MainScheduleType = {
    semester: SemesterType,
    rooms: Array<RoomType>,
    courses: Array<CourseType>
    data: Array<IScheduleBufferType>,
    instructors: Array<InstructorType>,
    inputs: Array<CurrentSemester>
    time_start: TimeType,
    time_end: TimeType,
    break_time_start: TimeType,
    break_time_end: TimeType,
} | null;



export interface RequestDBTypes {
    day_validity: string,
    message: string,
    name: string,
    room_name: string,
    section: string,
    time_end: string,
    time_start: string,
    time_requested: TimeType,
    uid: string,
    id: string
}

export interface RequestTypes {
    message: string,
    name: string,
    room: string,
    section: string,
    time_start: string,
    time_end: string,
    time_requested: TimeType,
    uid: string,
    id: string
}


export interface RejectDBTypes {
    day_validity: string,
    message: string,
    time_rejected: TimeType,
    uid: string
}

export interface AcceptDBTypes {
    day_validity: string,
    message: string,
    time_accepted: TimeType,
    uid: string,
    room: string,
    time_start: string,
    time_end: string,
    name: string,
    section: string,
    id: string
}


export interface AllocatedListType {
    time: string,
    section: string,
    subject: string,
    instructor: string
}

export interface FloorType {
    is_available: boolean,
    name: string,
    text: string,
    allocation: Array<AllocatedListType>,
    time_display: string

}