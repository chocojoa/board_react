import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "@/store/authSlice";
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
  const { user, token } = useSelector((state) => state.auth);
  const { menuList } = useSelector((state) => state.menu);

  const handleSignOut = async () => {
    try {
      await api({
        url: "/api/auth/signOut",
        method: "POST",
        data: { refreshToken: token.refreshToken },
      });
      dispatch(signOut());
      navigate("/");
    } catch (error) {
      console.error("로그아웃 실패:", error);
    }
  };

  const renderMenuContent = (menuId) => {
    const childMenus = menuList.filter(
      (menu) => menu.menuId !== menuId && menu.parentMenuId === menuId
    );

    return (
      <MenubarContent>
        {childMenus.map(
          ({ menuId, menuUrl, icon, menuName, childCount }) =>
            childCount === 0 && (
              <Link to={menuUrl} key={menuId}>
                <MenubarItem>
                  {icon && (
                    <LucideIcon name={icon} size={20} className="mr-2" />
                  )}
                  {menuName}
                </MenubarItem>
              </Link>
            )
        )}
      </MenubarContent>
    );
  };

  const renderMenuItem = ({
    menuId,
    parentMenuId,
    childCount,
    menuUrl,
    icon,
    menuName,
  }) => {
    if (parentMenuId !== 0) return null;

    if (childCount > 0) {
      return (
        <MenubarMenu key={menuId}>
          <MenubarTrigger>
            {icon && <LucideIcon name={icon} size={20} className="mr-2" />}
            {menuName}
          </MenubarTrigger>
          {renderMenuContent(menuId)}
        </MenubarMenu>
      );
    }

    return (
      <MenubarMenu key={menuId}>
        <Link to={menuUrl}>
          <MenubarTrigger>
            {icon && <LucideIcon name={icon} size={20} className="mr-2" />}
            {menuName}
          </MenubarTrigger>
        </Link>
      </MenubarMenu>
    );
  };

  return (
    <nav className="w-full border shadow-sm bg-white">
      <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 font-bold mr-10">
              <Link to="/">React 연습화면</Link>
            </div>
            <div className="flex flex-shrink-0 items-center space-x-6 mx-10 text-sm/[17px]">
              <Menubar className="border-none shadow-none">
                {menuList.map(renderMenuItem)}
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
                  <Link onClick={handleSignOut}>Sign out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
