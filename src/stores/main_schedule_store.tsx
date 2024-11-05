import { create } from "zustand";
import { MutatorMainScheduleType } from "../types/store_types";

export const useMainScheduleStore = create<MutatorMainScheduleType>((change) => ({
    get: null,
    set: (x?) => change((x != undefined) ? { get: x } : (state) => ({ get: state.get }))
}))
