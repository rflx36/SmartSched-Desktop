import { ClassInstructorType, ClassSectionType, ClassSessionType, UIStateType } from "./types/types"

export const DEFAULT_CLASS_SESSIONS: ClassSessionType = {
    time_start: "07:00",
    time_end: "20:00",
    courses: [],
    rooms: [],
    break_time_start: "12:00",
    break_time_end: "13:00"
}

export const DEFAULT_CLASS_SECTIONS: ClassSectionType = {
    year_active: 1,
    sem_active: "1st",
    course_active: "",
    data: []
}

export const DEFAULT_CLASS_INSTRUCTORS: ClassInstructorType = {
    instructors: []
}

export const DEFAULT_UI_STATE: UIStateType = {
    sidebar_active: "dashboard",
    sidebar_setup_step: 0,
    modal: "closed",
    modal_action: null,
    modal_message: "",
    modal_submessage: "",
    modal_edit_subjects: null,
    modal_edit_instructors: null,
    dropdown_course: ""
}
