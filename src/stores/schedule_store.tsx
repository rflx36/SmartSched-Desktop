import { create } from "zustand";
import { DEFAULT_VIEW_SCHEDULE } from "../constants";
import { MutatorScheduleType } from "../types/store_types";



export const useScheduleStore = create<MutatorScheduleType>((change) => ({
    get: DEFAULT_VIEW_SCHEDULE,
    set: (x?) => change((x != undefined) ? { get: x } : (state) => ({ get: state.get }))
}))

