import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Smile } from "lucide-react";

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
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "../ui/menubar";

const Nav = () => {
  const api = useAxios();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
  const user = auth.user;

  const [menu, setMenu] = useState([]);

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

  const retrieveMenus = () => {
    api({
      url: "/api/admin/menus",
      method: "GET",
    }).then((response) => {
      setMenu(response.data.data);
    });
  };

  const getMenuContent = (menuId) => {
    const childMenu = menu.filter(
      (e) => e.menuId !== menuId && e.groupId === menuId
    );
    return (
      <MenubarContent>
        {childMenu.map((m) => {
          if (m.depth === 2 && m.childCount === 0) {
            return (
              <Link to={m.menuUrl} key={m.menuId}>
                <MenubarItem>{m.menuName}</MenubarItem>
              </Link>
            );
          } else if (m.depth === 2 && m.childCount > 0) {
            return (
              <MenubarSub key={m.menuId}>
                <MenubarSubTrigger>{m.menuName}</MenubarSubTrigger>
                {getSubMenuContent(menuId, m.menuId)}
              </MenubarSub>
            );
          }
        })}
      </MenubarContent>
    );
  };

  const getSubMenuContent = (menuId, childMenuId) => {
    const subChildMenu = menu.filter(
      (e) =>
        e.menuId !== menuId &&
        e.groupId === menuId &&
        e.parentMenuId === childMenuId
    );
    return (
      <MenubarSubContent>
        {subChildMenu.map((m) => (
          <Link to={m.menuUrl} key={m.menuId}>
            <MenubarItem>{m.menuName}</MenubarItem>
          </Link>
        ))}
      </MenubarSubContent>
    );
  };

  useEffect(() => {
    retrieveMenus();
  }, []);

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
                  {menu.map((m) => {
                    if (m.depth === 1 && m.childCount > 0) {
                      return (
                        <MenubarMenu key={m.menuId}>
                          <MenubarTrigger>{m.menuName}</MenubarTrigger>
                          {getMenuContent(m.menuId)}
                        </MenubarMenu>
                      );
                    } else if (m.depth === 1 && m.childCount === 0) {
                      return (
                        <MenubarMenu key={m.menuId}>
                          <Link to={m.menuUrl}>
                            <MenubarTrigger>{m.menuName}</MenubarTrigger>
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
                    <Smile size={18} />
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
                    <Link to="#" onClick={signOut}>
                      Sign out
                    </Link>
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
