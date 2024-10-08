import { AuthSignOut } from "../../firebase/firebase_auth";
import { useUIStore } from "../../stores/ui_store"


export default function Navbar(props: { name: string | null}) {
    const ui_state = useUIStore();
    const url_text = ui_state.get.sidebar_active.charAt(0).toUpperCase() + ui_state.get.sidebar_active.slice(1);
    return (
        <div className="flex justify-between w-full h-[50px] border border-b-baseline-outline bg-baseline-base ">
            <div className="w-max m-[15px] text-grey-500 font-manrope-regular flex items-center">
                <p>{url_text}</p>
            </div>
            <div className="w-max gap-[30px] flex items-center mr-[30px]">
                <p className="font-manrope-medium text-grey-600 text-[14px]" >{props.name}</p>
                <div className="duration-75 rounded-full bg-baseline-border-base hover:bg-baseline-outline size-10 grid place-content-center cursor-pointer ease-in">
                    <img src="icons/icon-notification.png" />
                </div>
                <div onClick={AuthSignOut} className="duration-75 rounded-full bg-baseline-border-base  hover:bg-baseline-outline size-10 grid place-content-center cursor-pointer ease-in">
                    <img src="icons/icon-user.png" />
                </div>
            </div>
        </div>
    )
}