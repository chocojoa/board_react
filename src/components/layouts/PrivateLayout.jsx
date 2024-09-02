import { Outlet } from "react-router-dom";
import Nav from "./Nav";

const PrivateLayout = () => {
  return (
    <>
      <div className="min-h-full">
        <Nav />
        <main>
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default PrivateLayout;
