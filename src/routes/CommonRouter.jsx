import { Suspense } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import PrivateLayout from "@/components/layouts/PrivateLayout";
import PublicLayout from "@/components/layouts/PublicLayout";
import SignIn from "@/pages/auth/SignIn";
import SignUp from "@/pages/auth/SignUp";
import PostList from "@/pages/post/PostList";
import NotFound from "@/pages/common/NotFound";
import Dashboard from "@/pages/dashboard/Dashboard";
import Profile from "@/pages/user/Profile";
import PostCreate from "@/pages/post/PostCreate";
import PostDetail from "@/pages/post/PostDetail";
import PostEdit from "@/pages/post/PostEdit";
import UserList from "@/pages/admin/user/UserList";
import UserCreate from "@/pages/admin/user/UserCreate";
import UserDetail from "@/pages/admin/user/UserDetail";
import UserEdit from "@/pages/admin/user/UserEdit";

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
              <Route path="/boards/:categoryId/posts" element={<PostList />} />
              <Route
                path="/boards/:categoryId/posts/create"
                element={<PostCreate />}
              />
              <Route
                path="/boards/:categoryId/posts/:postId"
                element={<PostDetail />}
              />
              <Route
                path="/boards/:categoryId/posts/:postId/edit"
                element={<PostEdit />}
              />
              <Route path="/admin/users" element={<UserList />} />
              <Route path="/admin/users/create" element={<UserCreate />} />
              <Route path="/admin/users/:userId" element={<UserDetail />} />
              <Route path="/admin/users/:userId/edit" element={<UserEdit />} />
              <Route path="/user/profile" element={<Profile />} />
            </Route>
            <Route path="/*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};

export default CommonRouter;
