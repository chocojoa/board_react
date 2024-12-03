import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import authSlice from "@/store/authSlice";
import useAxios from "@/hooks/useAxios";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "../ui/menubar";
import LucideIcon from "../LucideIcon";

const Nav = () => {
  const api = useAxios();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const menu = useSelector((state) => state.menu);
  const user = auth.user;

  const signOut = () => {
    api({
      url: "/api/auth/signOut",
      method: "POST",
      data: {
        refreshToken: auth.token.refreshToken,
      },
    }).then(() => {
      dispatch(authSlice.actions.signOut());
      navigate("/");
    });
  };

  const getMenuContent = (menuId) => {
    const childMenu = menu.menuList.filter(
      (e) => e.menuId !== menuId && e.parentMenuId === menuId
    );
    return (
      <MenubarContent>
        {childMenu.map(
          (m) =>
            m.childCount === 0 && (
              <Link to={m.menuUrl} key={m.menuId}>
                <MenubarItem>
                  {m.icon && (
                    <LucideIcon name={m.icon} size={20} className="mr-2" />
                  )}
                  {m.menuName}
                </MenubarItem>
              </Link>
            )
        )}
      </MenubarContent>
    );
  };

  return (
    <>
      <nav className="w-full border shadow-sm bg-white">
        <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0 font-bold mr-10">
                <Link to="/">React 연습화면</Link>
              </div>
              <div className="flex flex-shrink-0 items-center space-x-6 mx-10 text-sm/[17px]">
                <Menubar className="border-none shadow-none">
                  {menu.menuList.length > 0 &&
                    menu.menuList.map((m) => {
                      if (m.parentMenuId === 0 && m.childCount > 0) {
                        return (
                          <MenubarMenu key={m.menuId}>
                            <MenubarTrigger>
                              {m.icon && (
                                <LucideIcon
                                  name={m.icon}
                                  size={20}
                                  className="mr-2"
                                />
                              )}
                              {m.menuName}
                            </MenubarTrigger>
                            {getMenuContent(m.menuId)}
                          </MenubarMenu>
                        );
                      } else if (m.parentMenuId === 0 && m.childCount === 0) {
                        return (
                          <MenubarMenu key={m.menuId}>
                            <Link to={m.menuUrl}>
                              <MenubarTrigger>
                                {m.icon && (
                                  <LucideIcon
                                    name={m.icon}
                                    size={20}
                                    className="mr-2"
                                  />
                                )}
                                {m.menuName}
                              </MenubarTrigger>
                            </Link>
                          </MenubarMenu>
                        );
                      }
                    })}
                </Menubar>
              </div>
            </div>
            <div className="flex-shrink-0 text-sm">
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <div className="flex items-center">
                    <LucideIcon name="Smile" size={18} />
                    <span className="ml-2">
                      {user.userName} ({user.email})
                    </span>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem>
                    <Link to="/user/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link onClick={signOut}>Sign out</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Nav;
