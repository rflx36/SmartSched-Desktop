
import { useUIStore } from "../../stores/ui_store"
import { SidebarsType } from "../../types/types";



export default function Sidebar() {
    const ui_state = useUIStore();

    return (
        <div className="w-[285px] h-full bg-grey-50 border border-r-baseline-outline z-50" >

            <div className="grid place-content-center w-full h-[150px] mb-[15px]">
                <img src="images/logo.png" />
            </div>
            <div className="h-max w-full relative">
                <SidebarNav icon_name="dashboard" />
                <SidebarNav icon_name="schedules" />
                <SidebarNav icon_name="setup" />
                {(ui_state.get.sidebar_active == "setup") ?
                    <SidebarNavSetup state_step={ui_state.get.sidebar_setup_step} />
                    : <></>
                }
                <SidebarNav icon_name="subjects" />
                <SidebarNav icon_name="instructors" />
                <div id="sidebar-highlight" className=" ease-in opacity-0  duration-100 absolute w-[calc(100%-40px)] mx-[20px] h-10 bg-baseline-border-base rounded-[5px] "></div>
            </div>
        </div>

    )
}

function SidebarNav(props: { icon_name: string }) {
    const ui_state = useUIStore();

    const GetSidebarIcon = () => {
        switch (ui_state.get.sidebar_active) {
            case "dashboard":
                break;
            case "schedules":
                break;
            case "setup":
                break;
            case "subjects":
                break;
            case "instructors":
                break;
            default:
                break;
        }
        let image_resource_url = "icon-" + props.icon_name + ".png";
        if (props.icon_name == ui_state.get.sidebar_active) {
            image_resource_url = "icon-" + props.icon_name + "-active.png";
        }
        return image_resource_url;
    }

    const ChangePage = () => {
        ui_state.get.sidebar_active = props.icon_name as SidebarsType;
        ui_state.get.background = false;
        ui_state.get.modal ="closed";
        ui_state.set();
    }

    const ChangeHover = () => {
        const highlight = document.getElementById("sidebar-highlight");

        highlight!.style.opacity = "1";
        
        switch (props.icon_name) {
            case "dashboard":
                highlight!.style.top = "0px";
                break;
            case "schedules":
                highlight!.style.top = "50px";
                break;
            case "setup":
                highlight!.style.top = "100px";
                break;
            case "subjects":
                if (ui_state.get.sidebar_active == "setup") {
                    highlight!.style.top = "256px";
                }
                else {
                    highlight!.style.top = "150px";
                }
                break;
            case "instructors":
                if (ui_state.get.sidebar_active == "setup") {

                    highlight!.style.top = "306px";
                }
                else {

                    highlight!.style.top = "200px";
                }
                break;

        }
    }
    const UnHover = () => {
        const highlight = document.getElementById("sidebar-highlight");
        
        highlight!.style.opacity = "0";
        
    }
    return (
        <button
            className="w-[245px] flex h-10  mt-[10px] ml-[20px] items-center z-10 relative outline-none"
            onClick={ChangePage}
            onMouseEnter={ChangeHover}
            onMouseLeave={UnHover}
        >
            <img className="m-2" src={"icons/" + GetSidebarIcon()} />
            <p className={" ml-[10px] " + ((props.icon_name != ui_state.get.sidebar_active) ? "font-manrope-medium text-grey-500" : "font-manrope-bold text-grey-750")} >{props.icon_name.charAt(0).toUpperCase() + props.icon_name.slice(1)}</p>
            {(props.icon_name == "setup")
                ? (
                    (ui_state.get.sidebar_active == "setup") ?
                        <img src="icons/icon-arrow.png" className="absolute right-[5px] scale-y-[-1]" /> :
                        <img src="icons/icon-arrow-inactive.png" className="absolute right-[5px] " />)

                : <></>}


        </button>
    )
}


function SidebarNavSetup(props: { state_step: number }) {

    return (
        <div className="flex ml-10 relative z-10 font-manrope-medium text-[14px]">
            <img src="images/sidebar-items-identifier.png" className="h-[79px]" />
            <div>
                {
                    (props.state_step < 4) ?
                        (

                            <div className="flex flex-col">
                                <p className=" m-4 text-grey-750">Inputs & Constraints</p>
                                <p className=" m-4 text-grey-500">Generate</p>
                            </div>
                        ) :
                        (
                            <div className="h-10 bg-red-300">
                                <p className="text-grey-500">Inputs & Constraints</p>
                                <p className="text-grey-750">Generate</p>
                            </div>
                        )

                }
            </div>
        </div>
    )
}