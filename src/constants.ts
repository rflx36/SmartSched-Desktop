import { ClassInstructorType, ClassSectionType, ClassSessionType, UIStateType, ViewScheduleType } from "./types/types"
const use_example = false;

export const DEFAULT_CLASS_SESSIONS: ClassSessionType = {
    time_start: "07:00",
    time_end: "19:00",
    courses: !use_example ? [] : [{ code: "BSIT", name: "Bachelors of Science in Information Technology" }],
    rooms: !use_example ? [] : [{
        room_name: "ROOM1",
        is_realtime: false
    },
    {
        room_name: "ROOM2",
        is_realtime: false
    },
    {
        room_name: "PRRC202",
        is_realtime: true,
        realtime_id: "232"
    }


    ],
    break_time_start: "12:00",
    break_time_end: "13:00"
}

export const DEFAULT_CLASS_SECTIONS: ClassSectionType = {
    year_active: 1,
    sem_active: "1st",
    course_active: "",
    data: !use_example ? [] : [{
        course: "BSIT",
        sections: 3,
        year: 1,
        subjects: [
            {
                code: "OOP",
                lab_is_dividable: false,
                lab_total_hours: 3,
                lec_is_dividable: true,
                lec_total_hours: 2,
                title: "DSSD"
            },
            {
                code: "PROG1",
                lab_is_dividable: false,
                lab_total_hours: 3,
                lec_is_dividable: true,
                lec_total_hours: 2,
                title: "DSSD"
            },
            {
                code: "GE MATH",
                is_dividable: true,
                total_hours: 3,
                title: "dssd"
            },
            {
                code: "PE",
                is_dividable: false,
                total_hours: 2,
                title: "dssd"
            }
        ]
    }]
}

export const DEFAULT_CLASS_INSTRUCTORS: ClassInstructorType = {
    instructors: !use_example ? [] : [{
        first_name: "Ronel",
        last_name: "balajediong",
        fulltime: true,
        preffered_subjects: [],
        monday: { time_end: "17:00", time_start: "08:00" },
        tuesday: { time_end: "17:00", time_start: "08:00" },
        thursday: { time_end: "17:00", time_start: "08:00" },
        friday: { time_end: "17:00", time_start: "08:00" },
        saturday: { time_end: "17:00", time_start: "08:00" },
    },
    {
        first_name: "Roland Fonz",
        last_name: "Lamoste",
        fulltime: true,
        preffered_subjects: [],
        monday: { time_end: "17:00", time_start: "08:00" },
        tuesday: { time_end: "17:00", time_start: "08:00" },
        friday: { time_end: "17:00", time_start: "08:00" },
        saturday: { time_end: "17:00", time_start: "08:00" },
    },
    {
        first_name: "Jeffrey",
        last_name: "Gonzales",
        fulltime: true,
        preffered_subjects: [],
        wednesday: { time_end: "17:00", time_start: "08:00" },
        tuesday: { time_end: "17:00", time_start: "08:00" },
        friday: { time_end: "17:00", time_start: "08:00" },
        thursday: { time_end: "17:00", time_start: "08:00" },
    }]
}

export const DEFAULT_UI_STATE: UIStateType = {
    sidebar_active: "dashboard",
    sidebar_setup_step: !use_example ? 0 : 4,
    modal: "closed",
    modal_action: null,
    modal_message: "",
    modal_submessage: "",
    modal_edit_subjects: null,
    modal_edit_instructors: null,
    modal_upload_auth: null,
    dropdown_course: ""
}

export const DEFAULT_VIEW_SCHEDULE: ViewScheduleType = {
    selected: "",
    data: { filter: "" },
    highlighted_id: "",
    filter_type: "room",
    view_availability: false
}



