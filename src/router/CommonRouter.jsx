import PrivateLayout from "@/components/layouts/PrivateLayout";
import PublicLayout from "@/components/layouts/PublicLayout";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import Board from "@/pages/board/BoardList";
import NotFound from "@/pages/common/NotFound";
import Dashboard from "@/pages/dashboard/Dashboard";
import { Suspense, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const CommonRouter = () => {
  const [auth, setAuth] = useState(false);

  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route
              path="/"
              element={
                auth ? (
                  <Navigate to="/dashboard" />
                ) : (
                  <Navigate to="/auth/signIn" />
                )
              }
            />
            <Route element={<PublicLayout />}>
              <Route path="/auth/signIn" element={<SignIn />} />
              <Route path="/auth/signUp" element={<SignUp />} />
            </Route>
            <Route element={<PrivateLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/board/board" element={<Board />} />
            </Route>
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};

export default CommonRouter;
