import { create } from "zustand";
import { DEFAULT_CLASS_SECTIONS, } from "../constants";
import { MutatorSectionType } from "../types/store_types";

export const useSectionStore = create<MutatorSectionType>((change) => ({
   get: DEFAULT_CLASS_SECTIONS,
   set: (x?) => change((x != undefined) ? { get: x } : (state) => ({ get: state.get }))
}))
