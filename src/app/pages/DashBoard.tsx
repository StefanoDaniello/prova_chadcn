import React from "react";
import { Chart } from "../components/Chart";

const DashBoard = () => {
  return (
    <div>
      <h1 className="text-3xl mb-10">Dashboard</h1>
      <div className="px-20">
        <Chart />
      </div>
    </div>
  );
};

export default DashBoard;
