import { Subject, SubjectHasLabLec } from "../../types/types";

export default function CheckSubjectIsLecLab(subject: Subject | SubjectHasLabLec){
    return ((subject as Subject).total_hours == undefined);
}