import { onAuthStateChanged, User } from "firebase/auth";
import ModalSections from "./components/modals/modal_sections";
import Navbar from "./components/navbar"
import Sidebar from "./components/sidebar"
import PageSetup from "./pages/setup page";
import { useUIStore } from "./stores/ui_store"
import SignInPage from "./pages/auth/sign in";
import { auth } from "./firebase/firebase_config";
import { useEffect, useState } from "react";
import ModalDelete from "./components/modals/modal_delete";
import ModalInstructors from "./components/modals/modal_instructors";
// import { useSectionStore } from "./stores/section_store";
// import { useSessionStore } from "./stores/session_store";

function App() {
  const ui_state = useUIStore();
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => setCurrentUser((user) ? user : null))
  }, [])

  if (currentUser != auth.currentUser) {
    setCurrentUser(auth.currentUser);
  }
  // if (auth.currentUser) {
  //   updateProfile(auth.currentUser, {
  //     displayName: "This is a test account"
  //   })
  // }
  // const sections = useSectionStore();
  // const sessions = useSessionStore();

  // console.log(sections.get);
  // console.log(sessions.get);
  if (currentUser == null) {
    return (
      <div className="w-full h-full grid place-content-center bg-baseline-base">
        <SignInPage />
      </div>
    )
  }
  else {
    return (
      <div className="flex h-full">
        <Sidebar />

        <div className="w-[calc(100%-285px)]">
          {
            (ui_state.get.modal != "closed") ?
              (
                <div className="w-[calc(100%-285px)] h-full grid place-content-center absolute ">
                  <div className="w-full h-full bg-black opacity-20 z-20 absolute "></div>
                  <div className="z-30">

                    {(ui_state.get.modal == "sections") && <ModalSections />}
                    {(ui_state.get.modal == "delete") && <ModalDelete />}
                    {(ui_state.get.modal == "instructors") && <ModalInstructors />}
                  </div>
                </div>
              )
              : <></>
          }

          <Navbar name={currentUser.displayName} />
          <Page />
        </div>

      </div>
    )
  }
}

function Page() {
  const ui_state = useUIStore();

  switch (ui_state.get.sidebar_active) {
    case "dashboard":
      return <></>;
    case "schedules":
      return <></>;
    case "setup":
      return <PageSetup />;
    case "subjects":
      return <></>;
    case "instructors":
      return <></>;

  }

}

export default App
