import { useUIStore } from "../../stores/ui_store"
import SetupStep_0 from "./setup steps/setup_step_0";
import SetupStep_1 from "./setup steps/setup_step_1";
import SetupStep_2 from "./setup steps/setup_step_2";
import SetupStep_3 from "./setup steps/setup_step_3";
import SetupStep_4 from "./setup steps/setup_step_4";



export default function PageSetup() {


    return (
        <>
            <SetupProgressContainer />
            <div className="w-full flex justify-center">
                <div className=" mt-5">
                    <SetupCurrentPage />
                </div>
            </div>
        </>
    )
}

function SetupCurrentPage() {
    const ui_state = useUIStore();

    switch (ui_state.get.sidebar_setup_step) {
        case 0:

            return <SetupStep_0 />;
        case 1:
            return <SetupStep_1 />;
        case 2:
            return <SetupStep_2 />;
        case 3:
            return <SetupStep_3 />;
        case 4:
            return <SetupStep_4 />;
        default:
            return <SetupStep_0 />;
    }
}
function SetupProgressContainer() {
    const ui_state = useUIStore();

    const ProgressActionPrevious = () => {
        ui_state.get.sidebar_setup_step = ui_state.get.sidebar_setup_step - 1;
        ui_state.set();
    }

    let color = "bg-[#E9AA96]"
    switch (ui_state.get.sidebar_setup_step) {
        case 2:
            color = "bg-[#C185A2]";
            break;
        case 3:
            color = "bg-[#6962AD]";

            break;
        case 4:
            color = "bg-grey-900";

            break;
    }
    return (
        <div className="w-full h-[80px] flex justify-center bg-baseline-base bg-opacity-50  border-b-baseline-outline border backdrop-blur-0">
            {
                (ui_state.get.sidebar_setup_step != 0) ? (
                    <div className="absolute w-max left-0 h-full bottom-0 top-0 my-auto flex items-center">
                        <button className="flex mx-5 hover:bg-grey-200 p-2 pr-4 rounded-md" onClick={ProgressActionPrevious}>
                            <img src="icons/icon-arrow.png" className="rotate-90" />
                            <p className="text-[16px] text-grey-900 font-manrope-semibold">Go Back</p>
                        </button>
                    </div>
                ) : <></>
            }



            <div className="flex justify-center items-center gap-[10px] w-[430px] ">
                {(ui_state.get.sidebar_setup_step >= 1) ? (<div className={"h-2 w-[100px] rounded-full ease-in duration-300 " + color} />) : (<div className="h-2 w-[100px] rounded-full bg-grey-300" />)}
                {(ui_state.get.sidebar_setup_step >= 2) ? (<div className={"h-2 w-[100px] rounded-full ease-in duration-300 " + color} />) : (<div className="h-2 w-[100px] rounded-full bg-grey-300" />)}
                {(ui_state.get.sidebar_setup_step >= 3) ? (<div className={"h-2 w-[100px] rounded-full ease-in duration-300 " + color} />) : (<div className="h-2 w-[100px] rounded-full bg-grey-300" />)}
                {(ui_state.get.sidebar_setup_step >= 4) ? (<div className={"h-2 w-[100px] rounded-full ease-in duration-300 " + color} />) : (<div className="h-2 w-[100px] rounded-full bg-grey-300" />)}
            </div>
            <div className="w-[430px] bottom-[6px] absolute flex justify-center font-manrope-medium text-[16px]">
                <p>{ui_state.get.sidebar_setup_step} / 4</p>
            </div>

        </div>
    )
}



export function SetupProceedButton(props: { valid: boolean, on_press?: () => void }) {
    const ui_state = useUIStore();

    const ProgressActionNext = () => {
        props.on_press
        ui_state.get.sidebar_setup_step = ui_state.get.sidebar_setup_step + 1;
        ui_state.set();
    }


    if (props.valid) {
        return (
            <div className="min-w-[1008px] w-input-full h-full absolute top-0 pointer-events-none">
                <button onClick={ProgressActionNext} className="pointer-events-auto z-10 w-[400px] absolute right-0 bottom-2  h-[40px] bg-grey-750 border border-grey-900 rounded-md hover:bg-grey-600" >
                    <p className="text-grey-100 font-manrope-bold text-[18px]">Proceed</p>
                </button>

            </div>
        )
    }
    else {
        return (
            <div className="min-w-[1008px] w-input-full h-full  absolute top-0 pointer-events-none">
                <button className="cursor-not-allowed z-10 w-[400px] pointer-events-auto opacity-25 absolute right-0 bottom-2  h-[40px] bg-grey-750 border border-grey-900 rounded-md " >
                    <p className="text-grey-100 font-manrope-bold text-[18px]">Proceed</p>
                </button>

            </div>
        )
    }


}