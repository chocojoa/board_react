import { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronDown, Smile } from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "@/store/useAuthStore";
import useMenuStore from "@/store/useMenuStore";
import useAxios from "@/hooks/useAxios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Nav = () => {
  const api = useAxios();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const signOut = useAuthStore((state) => state.signOut);
  const menuList = useMenuStore((state) => state.menuList);

  const [openMenuId, setOpenMenuId] = useState(null);
  const closeTimerRef = useRef(null);

  const parentMenus = menuList.filter((m) => m.parentMenuId === 0);

  const childMenus = (menuId) =>
    menuList.filter(
      (m) => m.parentMenuId === menuId && m.childCount === 0 && m.isDisplayed
    );

  const handleMouseEnter = (menuId) => {
    clearTimeout(closeTimerRef.current);
    setOpenMenuId(menuId);
  };

  const handleMouseLeave = () => {
    closeTimerRef.current = setTimeout(() => {
      setOpenMenuId(null);
    }, 80);
  };

  const handleSignOut = async () => {
    try {
      await api.post("/api/auth/signOut");
      signOut();
      navigate("/auth/signIn");
    } catch (error) {
      toast.error("로그아웃 도중 문제가 발생하였습니다.", {
        description: error.response?.data?.message,
      });
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center">

          {/* 로고 (좌측 고정) */}
          <div className="w-44 flex-shrink-0">
            <Link
              to="/"
              className="font-bold text-base tracking-tight hover:text-foreground/80 transition-colors"
            >
              React 연습화면
            </Link>
          </div>

          {/* 메뉴 (중앙) */}
          <div className="flex flex-1 justify-center">
            <div className="flex items-center gap-1">
              {parentMenus.map((menu) =>
                menu.childCount > 0 ? (
                  <div
                    key={menu.menuId}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(menu.menuId)}
                    onMouseLeave={handleMouseLeave}
                  >
                    <button
                      className={`flex items-center gap-1 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground ${
                        openMenuId === menu.menuId
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground/80"
                      }`}
                    >
                      {menu.menuName}
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${
                          openMenuId === menu.menuId ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openMenuId === menu.menuId && (
                      <div className="absolute left-0 top-full z-50 mt-1 min-w-40 rounded-md border bg-background py-1 shadow-md">
                        {childMenus(menu.menuId).map((child) => (
                          <Link
                            key={child.menuId}
                            to={child.menuUrl}
                            className="block px-3 py-2 text-sm text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
                            onClick={() => setOpenMenuId(null)}
                          >
                            {child.menuName}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : menu.isDisplayed ? (
                  <Link
                    key={menu.menuId}
                    to={menu.menuUrl}
                    className="rounded-md px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {menu.menuName}
                  </Link>
                ) : null
              )}
            </div>
          </div>

          {/* 프로필 드롭다운 (우측 고정) */}
          <div className="w-44 flex-shrink-0 flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent cursor-pointer">
                <Smile size={16} className="text-muted-foreground" />
                {user && (
                  <span className="max-w-32 truncate font-medium">
                    {user.userName}
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {user && (
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.userName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/user/profile")}>
                  프로필
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={handleSignOut}
                >
                  로그아웃
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
