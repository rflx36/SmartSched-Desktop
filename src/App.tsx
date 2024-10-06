import { useEffect } from "react";
import Navbar from "./components/navbar"
import Sidebar from "./components/sidebar"
import PageSetup from "./pages/setup page";
import { useUIStore } from "./stores/ui_store"

function App() {
  const ui_state = useUIStore();
  return (
    <div className="flex h-full">
      <Sidebar />

      <div className="w-[calc(100%-285px)]">
        {(ui_state.get.background) ? <div className="w-[calc(100%-285px)] h-full bg-black absolute opacity-20 z-20"></div> : <></>}
        <Navbar />
        <Page />
      </div>

    </div>
  )
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
