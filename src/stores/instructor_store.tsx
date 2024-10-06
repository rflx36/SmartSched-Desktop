import { create } from "zustand";
import { MutatorInstructorType } from "../types/store_types";
import { DEFAULT_CLASS_INSTRUCTORS } from "../constants";

export const useInstructorStore = create<MutatorInstructorType>((change) => ({
    get: DEFAULT_CLASS_INSTRUCTORS,
    set: (x?) => change((x != undefined) ? { get: x } : (state) => ({ get: state.get }))
}))
