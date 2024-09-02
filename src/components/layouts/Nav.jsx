import authSlice from "@/store/authSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Nav = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const signOut = () => {
    dispatch(authSlice.actions.signOut());
    navigate("/");
  };

  return (
    <>
      <nav className="border-b-[1px] shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 font-bold">
                <Link to="/">React Board</Link>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <Link
                    to="/dashboard"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-slate-100 hover:text-black"
                    aria-current="page"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/board"
                    className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-slate-100 hover:text-black"
                  >
                    Board
                  </Link>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {/* Profile dropdown */}
                <div className="relative ml-3 group">
                  <div>
                    <button
                      type="button"
                      className="relative flex max-w-ws items-center rounded-full text-sm"
                      id="user-menu-button"
                      aria-expanded="false"
                      aria-haspopup="true"
                    >
                      <span className="absolute -inset-1.5"></span>
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        alt=""
                      />
                    </button>
                  </div>
                  <div
                    className="absolute hidden group-hover:block dropdown-menu right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="user-menu-button"
                    tabIndex="-1"
                  >
                    <Link
                      to="/profile"
                      className="block px-4 py-2 mx-2 my-2 text-sm text-gray-700 hover:bg-slate-100 rounded-md"
                      role="menuitem"
                      tabIndex="-1"
                    >
                      Profile
                    </Link>
                    <Link
                      to="#"
                      className="block px-4 py-2 mx-2 my-2 text-sm text-gray-700 hover:bg-slate-100 rounded-md"
                      role="menuitem"
                      tabIndex="-1"
                      onClick={signOut}
                    >
                      Sign out
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
