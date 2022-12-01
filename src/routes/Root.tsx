import { Outlet } from "react-router-dom";
import "./Root.css";

const Root = () => (
  <div className="root">
    <Outlet />
  </div>
);

export default Root;
