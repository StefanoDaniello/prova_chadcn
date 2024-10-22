import { Chart } from "./app/components/Chart";
import { Outlet } from "react-router-dom";
import Header from "./app/components/Header";

function App() {
  return (
    <>
      <Header />
      <div className="section">
        <div className="container">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default App;
