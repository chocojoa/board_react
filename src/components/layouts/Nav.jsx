import { forwardRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Smile } from "lucide-react";

import { cn } from "@/lib/utils";
import authSlice from "@/store/authSlice";
import useAxios from "@/hooks/useAxios";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";

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

  const getNavigationMenuContent = (menuId) => {
    const childMenu = menu.filter(
      (e) => e.groupId === menuId && e.menuId !== menuId
    );
    return (
      <ul className="grid gap-3 p-2 md:w-[150px] lg:w-[150px]">
        {childMenu.map((e) => (
          <ListItem key={e.menuId} to={e.menuUrl}>
            {e.menuName}
          </ListItem>
        ))}
      </ul>
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
                <NavigationMenu>
                  <NavigationMenuList>
                    {menu.map((e) => {
                      if (!e.parentMenuId && e.childCount == 0) {
                        return (
                          <NavigationMenuItem key={e.menuId}>
                            <Link to={e.menuUrl}>{e.menuName}</Link>
                          </NavigationMenuItem>
                        );
                      } else if (!e.parentMenuId && e.childCount > 0) {
                        return (
                          <NavigationMenuItem key={e.menuId}>
                            <NavigationMenuTrigger>
                              {e.menuName}
                            </NavigationMenuTrigger>
                            <NavigationMenuContent>
                              {getNavigationMenuContent(e.menuId)}
                            </NavigationMenuContent>
                          </NavigationMenuItem>
                        );
                      }
                    })}
                  </NavigationMenuList>
                </NavigationMenu>
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

const ListItem = forwardRef(({ className, to, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          to={to}
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});

ListItem.displayName = "ListItem";

export default Nav;
