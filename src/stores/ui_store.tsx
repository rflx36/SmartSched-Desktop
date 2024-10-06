import { create } from "zustand";
import { MutatorUIType } from "../types/store_types";
import { DEFAULT_UI_STATE } from "../constants";

export const useUIStore = create<MutatorUIType>((change) => ({
    get: DEFAULT_UI_STATE,
    set: (x?) => change((x != undefined) ? { get: x } : (state) => ({ get: state.get }))
}))