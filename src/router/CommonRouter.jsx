import PrivateLayout from "@/components/layouts/PrivateLayout";
import PublicLayout from "@/components/layouts/PublicLayout";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import Board from "@/pages/board/Board";
import NotFound from "@/pages/common/NotFound";
import Dashboard from "@/pages/dashboard/Dashboard";
import Profile from "@/pages/user/Profile";
import { Suspense } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const CommonRouter = () => {
  const auth = useSelector((state) => state.auth);
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route
              element={
                !auth.isAuthenticated ? <PublicLayout /> : <Navigate to="/" />
              }
            >
              <Route path="/auth/signIn" element={<SignIn />} />
              <Route path="/auth/signUp" element={<SignUp />} />
            </Route>
            <Route
              element={
                auth.isAuthenticated ? (
                  <PrivateLayout />
                ) : (
                  <Navigate to="/auth/signIn" />
                )
              }
            >
              <Route path="/" element={<Navigate replace to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/board" element={<Board />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};

export default CommonRouter;
