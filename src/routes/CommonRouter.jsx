import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

const PrivateLayout = lazy(() => import("@/components/layouts/PrivateLayout"));
const PublicLayout = lazy(() => import("@/components/layouts/PublicLayout"));
const SignIn = lazy(() => import("@/pages/auth/SignIn"));
const SignUp = lazy(() => import("@/pages/auth/SignUp"));
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const PostList = lazy(() => import("@/pages/post/PostList"));
const PostCreate = lazy(() => import("@/pages/post/PostCreate"));
const PostDetail = lazy(() => import("@/pages/post/PostDetail"));
const PostEdit = lazy(() => import("@/pages/post/PostEdit"));
const Profile = lazy(() => import("@/pages/user/Profile"));
const UserList = lazy(() => import("@/pages/admin/user/UserList"));
const UserCreate = lazy(() => import("@/pages/admin/user/UserCreate"));
const UserDetail = lazy(() => import("@/pages/admin/user/UserDetail"));
const UserEdit = lazy(() => import("@/pages/admin/user/UserEdit"));
const MenuList = lazy(() => import("@/pages/admin/menu/MenuList"));
const Role = lazy(() => import("@/pages/admin/role/Role"));
const NotFound = lazy(() => import("@/pages/common/NotFound"));

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

              <Route path="/boards/:categoryId/posts">
                <Route index element={<PostList />} />
                <Route path="create" element={<PostCreate />} />
                <Route path=":postId" element={<PostDetail />} />
                <Route path=":postId/edit" element={<PostEdit />} />
              </Route>

              <Route path="/admin/users">
                <Route index element={<UserList />} />
                <Route path="create" element={<UserCreate />} />
                <Route path=":userId" element={<UserDetail />} />
                <Route path=":userId/edit" element={<UserEdit />} />
              </Route>

              <Route path="/admin/menus" element={<MenuList />} />
              <Route path="/admin/roles" element={<Role />} />
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
