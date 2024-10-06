import { ClassInstructorType, ClassSectionType, ClassSessionType, UIStateType } from "./types";

export interface MutatorSectionType {
    get: ClassSectionType,
    set: (property?: ClassSectionType) => void
}

export interface MutatorSessionType {
    get: ClassSessionType,
    set: (property?: ClassSessionType) => void
}

export interface MutatorInstructorType {
    get: ClassInstructorType,
    set: (property?: ClassInstructorType) => void
}

export interface MutatorUIType {
    get: UIStateType,   
    set: (property?: UIStateType) => void
}

