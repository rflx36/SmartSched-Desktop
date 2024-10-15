import { useState } from "react"
import { Subject, SubjectHasLabLec, YearType } from "../../types/types";
import { useSectionStore } from "../../stores/section_store";
import Checkbox from "../checkbox";
import Button from "../button";
import Chip from "../chip";
import { useUIStore } from "../../stores/ui_store";
// import Dropdown from "../dropdown";
import Dropdown, { IOptions } from "../dropdown";
import { useSessionStore } from "../../stores/session_store";
import Input from "../input";
import { useInstructorStore } from "../../stores/instructor_store";


export default function ModalSections() {
    const ui_state = useUIStore();
    const sections = useSectionStore();
    const session = useSessionStore();
    const instructors = useInstructorStore();

    const Modifying = ui_state.get.modal_edit_subjects
    const default_course = (Modifying) ? { value: Modifying.course.code, label: Modifying.course.name } : undefined;

    const default_sections = (Modifying) ? Modifying.sections : 1;
    const default_subjects = (Modifying) ? Modifying.subjects : [];



    const [sectionAmount, setSectionAmount] = useState(default_sections);
    const [UIStep, setUIStep] = useState(1);
    const [selection, setSelection] = useState<Subject | SubjectHasLabLec | null>(null);


    const [subjectTitle, setSubjectTitle] = useState("");
    const [subjectCode, setSubjectCode] = useState("");
    const [lecLab, setLecLab] = useState(false);
    const [baseHours, setBaseHours] = useState(1);
    const [basePartitionable, setBasePartitionable] = useState(true);

    const [lecHours, setLecHours] = useState(2);
    const [lecPartitionable, setLecPartitionable] = useState(true);
    const [labHours, setLabHours] = useState(3);
    const [labPartitionable, setLabPartitionable] = useState(false);

    const sections_data = sections.get;

    const selected_course = sections_data.course_active
    const selected_year = sections_data.year_active;
    const selected_sem = sections_data.sem_active;

    const [subjects, setSubjects] = useState<Array<Subject | SubjectHasLabLec>>(default_subjects);
    const data = sections.get.data.filter(x => x.year == sections.get.year_active).map(x => x.course);
    const course_available = session.get.courses.filter(x => !data.includes(x.code))
    const course_options = course_available.map((e) => ({ value: e.code, label: e.name }));

    const [course, setCourse] = useState<IOptions | undefined>(default_course);


    const Proceed = () => {
        setUIStep(2);
        sections.get.course_active = course!.value;
        sections.set();

        ui_state.get.dropdown_course = course!.value;
        ui_state.set();
    }

    const EditSubject = (subject: Subject | SubjectHasLabLec) => {
        setSubjectTitle(subject.title);
        setSubjectCode(subject.code);
        const is_leclab = (subject as Subject).total_hours == null;
        setLecLab(is_leclab);
        if (is_leclab) {
            const sub = subject as SubjectHasLabLec;
            setLecHours(sub.lec_total_hours);
            setLecPartitionable(sub.lec_is_dividable);
            setLabHours(sub.lab_total_hours);
            setLabPartitionable(sub.lab_is_dividable);
        }
        else {
            const sub = subject as Subject;
            setBaseHours(sub.total_hours);
            setBasePartitionable(sub.is_dividable);
        }
        setSelection(subject);

    }
    const RemoveSubject = (subject: Subject | SubjectHasLabLec) => {
        const sub = subjects.filter(x => x != subject);
        CancelEdit();
        setSubjects(sub);
        if (instructors.get.instructors.length > 0) {
            const modified_data = instructors.get.instructors.map(x => {
                const preffered_subjects = x.preffered_subjects.filter(i => i != subject);
                return { ...x, preffered_subjects: preffered_subjects };
            })
            instructors.get.instructors = modified_data;
            instructors.set();

        }
    }
    const CancelEdit = () => {

        setSubjectTitle("");
        setSubjectCode("");
        setSelection(null);

    }
    const SaveSubject = () => {
        const subject_index = subjects.findIndex(x => x == selection);
        const modified_subject = subjects;

        if (lecLab) {
            const subject_data = {
                title: subjectTitle,
                code: subjectCode,
                lab_total_hours: labHours,
                lab_is_dividable: labPartitionable,
                lec_total_hours: lecHours,
                lec_is_dividable: lecPartitionable,

            }

            modified_subject[subject_index] = subject_data;
        }
        else {
            const subject_data = {
                title: subjectTitle,
                code: subjectCode,
                total_hours: baseHours,
                is_dividable: basePartitionable,

            }

            modified_subject[subject_index] = subject_data;
        }

        if (instructors.get.instructors.length > 0) {

            const amount = instructors.get.instructors.map(x => x.preffered_subjects.filter(i => i == selection));
            if (amount.length == 1) {
                const modified_data = instructors.get.instructors.map(x => {
                    const preffered_index = x.preffered_subjects.findIndex(i => i == selection);
                    const preffered_modified = x.preffered_subjects;
                    preffered_modified[preffered_index] = modified_subject[subject_index];
                    return { ...x, preffered_subjects: preffered_modified };
                })
                instructors.get.instructors = modified_data;
                instructors.set();
            }


        }

        setSubjects(modified_subject);
        setSubjectTitle("");
        setSubjectCode("");
        setSelection(null);
    }


    const AddSubject = () => {

        if (lecLab) {
            const subject_data = {
                title: subjectTitle,
                code: subjectCode,
                lab_total_hours: labHours,
                lab_is_dividable: labPartitionable,
                lec_total_hours: lecHours,
                lec_is_dividable: lecPartitionable,

            }
            setSubjects(x => [...x, subject_data]);
        }
        else {
            const subject_data = {
                title: subjectTitle,
                code: subjectCode,
                total_hours: baseHours,
                is_dividable: basePartitionable,

            }
            setSubjects(x => [...x, subject_data]);
        }
        setSubjectTitle("");
        setSubjectCode("");
    }

    const Finish = () => {
        ui_state.get.modal_edit_subjects = null;
        ui_state.get.modal = "closed";
        ui_state.set();
        setUIStep(1);
        setSubjectTitle("");
        setSubjectCode("");
        const current_data = sections.get.data;

        const similar_data_index = current_data.findIndex(e => e.course == selected_course && e.year == sections!.get.year_active)

        if (similar_data_index != -1) {
            current_data[similar_data_index] = { ...current_data[similar_data_index], subjects: subjects, sections: sectionAmount };

            console.log("Modified");
        }
        else {
            current_data.push({
                year: sections!.get.year_active,
                subjects: subjects,
                course: selected_course,
                sections: sectionAmount
            })
            console.log("Added");
        }
        sections.get.data = current_data;
        sections.set();
        setSectionAmount(1);
        setSubjects([]);
    }

    const Close = () => {
        ui_state.get.modal = "closed";

        ui_state.get.modal_edit_subjects = null;
        ui_state.set();
    }

    const is_eligible_to_add_subject = (subjectCode.trim() !== '' && subjectTitle.trim() !== '' && ((!lecLab) ? (!isNaN(baseHours)) : (!isNaN(lecHours) && !isNaN(labHours))));

    return (
        <div className="relative size-max bg-grey-100 outline outline-1 outline-neutral-600/10 rounded-lg z-50 px-4 py-2">
            <button
                onClick={Close}
                className="hover:bg-neutral-400/75 size-3 rounded-full p-2 absolute top-2 right-2 bg-neutral-300 grid place-content-center bg-[url('icons/icon-close.png')] bg-no-repeat bg-center bg-[length:10px_10px]" >
            </button>

            {
                (UIStep == 1) ?
                    (
                        <div className="min-w-[442px] ">

                            <div className=" font-manrope-semibold text-sm mb-1 text-neutral-500">
                                <p>{(Modifying!= null)&&"Editing"} {YearTextDecoder(selected_year)} {selected_sem} Sem</p>
                            </div>
                            <div className="border-neutral-300 mt-4 border rounded-md w-auto h-max p-4 pb-3">

                                <Dropdown label="Selected Course" options={course_options} value={course} onChange={x => setCourse(x)} />
                                <hr className="my-4" ></hr>
                                <Input size="small" label="Sections Amount" type="number" value={sectionAmount} min={1} onChange={(e) => setSectionAmount(e)} />

                                <div className="flex flex-row-reverse">
                                    <Button text="Proceed" onClick={Proceed} roundedFull widthType="medium" isDisabled={!(sectionAmount >= 1 && course != undefined)} />
                                </div>
                            </div>

                        </div>
                    ) :
                    (
                        <>
                            <div className=" font-manrope-semibold text-sm mb-1 text-neutral-500 flex items-center gap-2">
                                <button className="text-grey-900 flex items-center rounded-full hover:bg-grey-200" onClick={() => setUIStep(1)}>
                                    <img src="icons/icon-arrow.png" className="rotate-90" />
                                    <p className="mr-3">Back</p>
                                </button>
                                <p>{(Modifying!= null)&&"Editing"} {selected_course} {YearTextDecoder(selected_year)} {selected_sem} Sem</p>
                            </div>
                            <div className=" drop-shadow-sm border-neutral-300 mt-4 border rounded-md w-auto h-max p-4 pb-3">
                                <div className="flex gap-2 mb-2">

                                    <div className="flex flex-col">

                                        <label className="font-manrope-semibold text-sm mb-1" >Subject Code</label>
                                        <input
                                            required
                                            type="text"
                                            value={subjectCode}
                                            className="h-9 font-manrope-regular   px-3 py-[4px] max-w-36 tabular-nums outline-1 focus:outline-2 focus:outline-neutral-400 outline  rounded-[4px] outline-neutral-300 bg-neutral-200/50 "
                                            onChange={x => setSubjectCode(x.currentTarget.value.toLocaleUpperCase())}
                                        />
                                    </div>
                                    <div className="flex-grow flex flex-col">
                                        <label className="font-manrope-semibold text-sm mb-1" >Subject Title</label>

                                        <input
                                            required
                                            type="text"
                                            value={subjectTitle}
                                            className="h-9 font-manrope-regular  min-w-64 px-3 py-[4px] tabular-nums outline-1 focus:outline-2 focus:outline-neutral-400 outline  rounded-[4px] outline-neutral-300 bg-neutral-200/50 "
                                            onChange={x => setSubjectTitle(x.currentTarget.value)}
                                        />
                                    </div>
                                </div>

                                <Checkbox name="As lectures and lab sessions" checked={lecLab} onClick={x => setLecLab(x)} textStyle="italic" />
                                <hr className="my-4" ></hr>

                                {
                                    (!lecLab) ?
                                        (
                                            <div className="flex flex-col gap-2">
                                                <div className="flex flex-col w-[50%]">
                                                    <label className="font-manrope-semibold text-sm mb-1" >Hours Allocated (Weekly)</label>
                                                    <input
                                                        required
                                                        type="number"
                                                        min={1}
                                                        value={baseHours}
                                                        className="h-9 max-w-48  font-manrope-regular px-3 py-[4px] tabular-nums outline-1 focus:outline-2 focus:outline-neutral-400 outline  rounded-[4px] outline-neutral-300 bg-neutral-200/50 "
                                                        onChange={x => setBaseHours(x.currentTarget.valueAsNumber)}
                                                    />
                                                </div>

                                                <Checkbox name="Is Partitionable" checked={basePartitionable} onClick={x => setBasePartitionable(x)} textStyle="base" />
                                            </div>
                                        ) : (
                                            <div className="flex justify-between">
                                                <div className="w-auto  flex flex-col gap-2 relative">

                                                    <p className="absolute text-sm top-[-15px] italic opacity-50" >Lectures</p>
                                                    <div className="flex flex-col">
                                                        <label className="font-manrope-semibold text-sm mb-1" >Hours Allocated (Weekly)</label>
                                                        <input
                                                            required
                                                            type="number"
                                                            min={1}
                                                            value={lecHours}
                                                            className="h-9 max-w-48 font-manrope-regular px-3 py-[4px] tabular-nums outline-1 focus:outline-2 focus:outline-neutral-400 outline  rounded-[4px] outline-neutral-300 bg-neutral-200/50 "
                                                            onChange={x => setLecHours(x.currentTarget.valueAsNumber)}
                                                        />
                                                    </div>

                                                    <Checkbox name="Is Partitionable" checked={lecPartitionable} onClick={x => setLecPartitionable(x)} textStyle="base" />
                                                </div>
                                                <div className="w-auto flex flex-col gap-2 relative">

                                                    <p className="absolute text-sm top-[-15px] italic opacity-50" >Labaratory</p>

                                                    <div className="flex flex-col">
                                                        <label className="font-manrope-semibold text-sm mb-1" >Hours Allocated (Weekly)</label>
                                                        <input
                                                            required
                                                            type="number"
                                                            min={1}
                                                            value={labHours}
                                                            className="h-9 max-w-48 font-manrope-regular px-3 py-[4px] tabular-nums outline-1 focus:outline-2 focus:outline-neutral-400 outline  rounded-[4px] outline-neutral-300 bg-neutral-200/50 "
                                                            onChange={x => setLabHours(x.currentTarget.valueAsNumber)}
                                                        />
                                                    </div>

                                                    <Checkbox name="Is Partitionable" checked={labPartitionable} onClick={x => setLabPartitionable(x)} textStyle="base" />
                                                </div>
                                            </div>
                                        )
                                }

                                <hr className="my-4" ></hr>
                                <div className="w-full flex gap-3 justify-end">
                                    {
                                        (selection == null) ?
                                            <Button text="Add Subject" onClick={AddSubject} isDisabled={!is_eligible_to_add_subject} widthType="full" />
                                            :
                                            (
                                                <>
                                                    <Button text="Cancel" onClick={CancelEdit} widthType="medium" />
                                                    <Button text="Save Changes" onClick={SaveSubject} isDisabled={!is_eligible_to_add_subject} widthType="full" />
                                                </>

                                            )

                                    }
                                </div>
                            </div>
                            <div className=" font-manrope-semibold text-sm my-1 text-neutral-500">
                                <p>Subjects</p>
                            </div>
                            <div className=" drop-shadow-sm border-neutral-300 border rounded-md w-[442px] overflow-y-scroll p-4 pb-3">
                                <div className="min-h-20  flex flex-wrap gap-2">
                                    {
                                        subjects.map((e, i) => {
                                            if (e == selection) {
                                                return <Chip style="highlighted" key={i} text={e.code} title={e.title} onClick={() => EditSubject(e)} onRemove={() => RemoveSubject(e)} />
                                            }
                                            else {
                                                return <Chip key={i} text={e.code} title={e.title} onClick={() => EditSubject(e)} onRemove={() => RemoveSubject(e)} />

                                            }
                                        })
                                    }
                                </div>
                                <hr className="my-4"></hr>
                                <div className="w-full flex justify-end">
                                    <Button text="Finish" onClick={Finish} roundedFull isDisabled={subjects.length == 0} widthType="medium" />
                                </div>
                            </div>
                        </>
                    )
            }


        </div>
    )
}



function YearTextDecoder(n: YearType) {
    switch (n) {
        case 1:
            return "1st Year";
        case 2:
            return "2nd Year";
        case 3:
            return "3rd Year";
        case 4:
            return "4th Year";
    }
}