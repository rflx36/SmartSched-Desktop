import { useState } from "react";
import { useUIStore } from "../../stores/ui_store";
import Baseline from "../baseline";
import Input from "../input";
import ModalContainer from "./modal_container";
import Checkbox from "../checkbox";
import Button from "../button";
import Dropdown, { IOptions } from "../dropdown";
import { useSectionStore } from "../../stores/section_store";
import { CurrentSemester, InstructorType, Subject, SubjectHasLabLec } from "../../types/types";
import ChipContainer from "../chip/container";
import Chip from "../chip";
import { useInstructorStore } from "../../stores/instructor_store";








export default function ModalInstructors() {
    const ui_state = useUIStore();
    const sections = useSectionStore();
    const instructors = useInstructorStore();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [isFullTime, setIsFullTime] = useState(true);
    const [currentSubjectSelection, setCurrentSubjectSelection] = useState<IOptions | undefined>();

    //({ value: e.code, label: e.name })


    const [prefferedSubjects, setPrefferedSubjects] = useState<Array<string>>([]);


    const subjects_data = sections.get.data.map((e: CurrentSemester) => e.subjects);


    // const subjects = sem.map((e:Subject | SubjectHasLabLec) => ({ value: e.code, label: e.title}))
    // const result = sem.map((e: Subject | SubjectHasLabLec) => {
    //     return { value: e.code, label: e.title };
    // });



    const subjects_list = subjects_data.flat().map(e => ({ value: e.code, label: e.title }));
    const subject_available_list = subjects_list.filter(e => !prefferedSubjects.includes(e.value));

    const AddPreferred = () => {
        if (currentSubjectSelection == undefined) {
            return;
        }

        setPrefferedSubjects(x => [...x, currentSubjectSelection!.value]);
        setCurrentSubjectSelection(undefined);
    }

    const Finish = () => {

        const current_instructor: InstructorType = {
            first_name: firstName,
            last_name: lastName,
            fulltime: isFullTime,
            preffered_subjects: subjects_data.flat().filter(e => prefferedSubjects.includes(e.code)),
            load: 0
        }
        instructors.get.instructors.push(current_instructor);
        instructors.set();

        ui_state.get.modal = "closed";
        ui_state.set();

        setFirstName("");
        setLastName("");
        setIsFullTime(true);
        setPrefferedSubjects([]);

    }
    const isEligibleToFinish = firstName != "" && lastName != "";
    return (
        <ModalContainer isActive={ui_state.get.modal == "instructors"}>

            <div className=" min-w-[420px] font-manrope-semibold text-sm mb-1 text-neutral-500">
                <p> Add Instructors</p>
            </div>
            <Baseline widthFull>
                <div className="flex">
                    <Input size="large" label="First Name" type="text" value={firstName} onChange={x => setFirstName(x)} />
                    <Input label="Last Name" type="text" value={lastName} onChange={x => setLastName(x)} />
                </div>
                <div className="mx-1">
                    <Checkbox name="Is Full Time" default={isFullTime} onChange={() => setIsFullTime(!isFullTime)} />
                </div>
            </Baseline>
            <div className=" font-manrope-semibold text-sm mb-1 text-neutral-500">
                <p> Preffered Subjects</p>
            </div>
            <Baseline widthFull >
                <div className="flex items-end justify-between ">
                    <div className="flex-grow">
                        <Dropdown label="Select Subject" options={subject_available_list} onChange={x => setCurrentSubjectSelection(x)} value={currentSubjectSelection} />
                    </div>
                    <Button text="Add Subject" onClick={AddPreferred} />
                </div>

                <hr className="my-4"></hr>
                <ChipContainer>
                    {prefferedSubjects.map((e, i) => {

                        const RemovePrefferedSubject = () => {
                            setPrefferedSubjects(subjects => subjects.filter((_, index) => i !== index))
                        }

                        return <Chip key={i} text={e} title={e} onRemove={RemovePrefferedSubject} />

                    }
                    )}
                </ChipContainer>
            </Baseline>
            <div className="w-full flex justify-end">
                <Button text="Finish" onClick={Finish} isDisabled={!isEligibleToFinish}/>
            </div>
        </ModalContainer>
    )
}