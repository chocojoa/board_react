import { Outlet, useLocation } from "react-router-dom";
import Nav from "./Nav";
import { useSelector } from "react-redux";
import { getAllUrl } from "@/auth/allowUrl";
import NotFound from "@/pages/common/NotFound";

const PrivateLayout = () => {
  const menu = useSelector((state) => state.menu);
  const menuList = menu.menuList
    .filter((m) => m.menuUrl !== "")
    .map((m) => m.menuUrl);
  const location = useLocation();

  const getUrlStatus = () => {
    for (let i = 0; i < menuList.length; i++) {
      if (location.pathname.includes(menuList[i])) {
        return true;
      }
    }

    const allowUrl = getAllUrl();
    return allowUrl.includes(location.pathname);
  };

  return (
    <>
      {getUrlStatus() ? (
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
      ) : (
        <NotFound />
      )}
    </>
  );
};

export default PrivateLayout;
