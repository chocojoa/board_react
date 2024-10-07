import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import authSlice from "@/store/authSlice";
import useAxios from "@/hooks/useAxios";

import { LayoutDashboard, Smile, StickyNote, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const Nav = () => {
  const api = useAxios();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state) => state.auth);
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

  return (
    <>
      <nav className="w-full border shadow-sm bg-white">
        <div className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex">
              <div className="flex-shrink-0 font-bold">
                <Link to="/">React 연습화면</Link>
              </div>
              <div className="flex flex-shrink-0 items-center space-x-6 mx-10 text-sm/[17px]">
                <Link to="/dashboard">
                  <div className="flex items-center w-full">
                    <LayoutDashboard size={18} className="text-gray-500" />
                    <span className="ml-2">대시보드</span>
                  </div>
                </Link>
                <Link to="/boards/free/posts">
                  <div className="flex items-center w-full">
                    <StickyNote size={18} className="text-gray-500" />
                    <span className="ml-2">자유게시판</span>
                  </div>
                </Link>
                <Link to="/users">
                  <div className="flex items-center w-full">
                    <User size={18} className="text-gray-500" />
                    <span className="ml-2">사용자</span>
                  </div>
                </Link>
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
                    <Link to="/profile">Profile</Link>
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
