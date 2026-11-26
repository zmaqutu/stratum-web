import { MapCanvas } from "./components/MapCanvas";
import { MapToolbar, StatusBar } from "./components/MapToolbar";
import { Sidebar } from "./components/Sidebar";

export function App() {
  return (
    <div className="workspace">
      <MapToolbar />
      <main className="workspace-main">
        <Sidebar />
        <MapCanvas />
      </main>
      <StatusBar />
    </div>
  );
}
