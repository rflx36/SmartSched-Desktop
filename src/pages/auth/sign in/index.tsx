import React, { useState } from "react";
import { AuthSignIn } from "../../../firebase/firebase_auth";




export default function SignInPage() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [signingIn, setSigningIn] = useState(false);

    const OnSigningIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!signingIn) {
            setSigningIn(true);
            const message = await AuthSignIn(email, password);
            setMessage(message);
            setSigningIn(false);
        }
    }
    return (
        
        <form onSubmit={OnSigningIn}>
            <div className="w-[422px] relative h-[600px] rounded-[25px] bg-grey-50 border border-baseline-outline flex flex-col items-center">
                <img className="mt-[60px] mb-[120px]" src="images/logo.png" alt="smart-sched-logo" />

                <label className="left-[42px] absolute translate-y-[245px] font-manrope-bold text-[8px] text-grey-600">EMAIL</label>
                <label className="left-[42px] absolute translate-y-[320px] font-manrope-bold text-[8px] text-grey-600">PASSWORD</label>

                <input
                    disabled={signingIn}
                    className="outline-grey-400  font-manrope-bold text-grey-750 w-[365px] px-4 pt-[10px] h-[55px] bg-grey-200 rounded-[15px]"
                    type="email" value={email} onChange={e => setEmail(e.currentTarget.value)}  />
                <div className="h-[20px] w-full" />
                <input
                    disabled={signingIn}
                    className="outline-grey-400  font-manrope-bold text-grey-750 w-[365px] px-4 pt-[10px] h-[55px] bg-grey-200 rounded-[15px]"
                    type="password" value={password} onChange={e => setPassword(e.currentTarget.value)}  />
                <div className="h-[20px] w-full" />
                <div className="w-[365px] h-[50px] rounded-[15px] bg-grey-300 grid place-content-center relative">
                    <div className="w-[357px] absolute h-[42px] rounded-[12px] pointer-events-none z-10 border border-black/25  m-auto left-0 right-0 top-0 bottom-0" />
                    <button
                        className="flex items-center justify-center w-[357px] m-1 h-[42px]  outline-grey-900 rounded-[12px]  
                bg-bottom hover:bg-top ease-bezier-in duration-300 bg-[length:200px_100px]
                bg-[linear-gradient(0deg,_rgba(54,54,54,1)_0%,_rgba(71,68,93,1)_45%,_rgba(105,98,173,1)_72%,_rgba(193,133,162,1)_90%,_rgba(233,170,150,1)_100%)]"
                        type="submit"
                        disabled={signingIn}
                    >
                        {
                            !signingIn ?
                                (<p className="font-manrope-bold text-[16px]  text-white">Log In</p>)
                                :
                                (<img src="images/loader.png" className="animate-spin" />)
                        }

                    </button>
                </div>
                {message && <p className="font-manrope-semibold text-invalid text-[14px]">{message}</p>}
            </div>
        </form>
    )

}