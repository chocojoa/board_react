import { Outlet } from "react-router-dom";
import Nav from "./Nav";

const PrivateLayout = () => {
  return (
    <>
      <div className="bg-slate-50 h-screen">
        <Nav />
        <main>
          <div className="mx-auto max-w-full px-4 py-6 sm:px-6 lg:px-8">
            <div className="bg-white border rounded-sm px-6 py-4">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default PrivateLayout;
