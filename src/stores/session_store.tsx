import { create } from "zustand";
import { MutatorSessionType } from "../types/store_types";
import { DEFAULT_CLASS_SESSIONS } from "../constants";

export const useSessionStore = create<MutatorSessionType>((change) => ({
    get: DEFAULT_CLASS_SESSIONS,
    set: (x?) => change((x != undefined) ? { get: x } : (state) => ({ get: state.get }))
}))