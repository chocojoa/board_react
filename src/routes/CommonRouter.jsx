import { lazy, Suspense } from "react";
import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// 레이아웃 컴포넌트
const PrivateLayout = lazy(() => import("@/components/layouts/PrivateLayout"));
const PublicLayout = lazy(() => import("@/components/layouts/PublicLayout"));

// 인증 관련 페이지
const SignIn = lazy(() => import("@/pages/auth/SignIn"));
const SignUp = lazy(() => import("@/pages/auth/SignUp"));

// 일반 페이지
const Dashboard = lazy(() => import("@/pages/dashboard/Dashboard"));
const Profile = lazy(() => import("@/pages/user/Profile"));
const NotFound = lazy(() => import("@/pages/common/NotFound"));

// 게시판 관련 페이지
const PostList = lazy(() => import("@/pages/post/PostList"));
const PostCreate = lazy(() => import("@/pages/post/PostCreate"));
const PostDetail = lazy(() => import("@/pages/post/PostDetail"));
const PostEdit = lazy(() => import("@/pages/post/PostEdit"));

// 관리자 페이지
const UserList = lazy(() => import("@/pages/admin/user/UserList"));
const UserCreate = lazy(() => import("@/pages/admin/user/UserCreate"));
const UserDetail = lazy(() => import("@/pages/admin/user/UserDetail"));
const UserEdit = lazy(() => import("@/pages/admin/user/UserEdit"));
const MenuList = lazy(() => import("@/pages/admin/menu/MenuList"));
const Role = lazy(() => import("@/pages/admin/role/Role"));

const CommonRouter = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  const publicRoutes = (
    <Route element={!isAuthenticated ? <PublicLayout /> : <Navigate to="/" />}>
      <Route path="/auth/signIn" element={<SignIn />} />
      <Route path="/auth/signUp" element={<SignUp />} />
    </Route>
  );

  const privateRoutes = (
    <Route
      element={
        isAuthenticated ? <PrivateLayout /> : <Navigate to="/auth/signIn" />
      }
    >
      <Route path="/" element={<Navigate replace to="/dashboard" />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/user/profile" element={<Profile />} />

      {/* 게시판 라우트 */}
      <Route path="/boards/:categoryId/posts">
        <Route index element={<PostList />} />
        <Route path="create" element={<PostCreate />} />
        <Route path=":postId" element={<PostDetail />} />
        <Route path=":postId/edit" element={<PostEdit />} />
      </Route>

      {/* 관리자 라우트 */}
      <Route path="/admin/users">
        <Route index element={<UserList />} />
        <Route path="create" element={<UserCreate />} />
        <Route path=":userId" element={<UserDetail />} />
        <Route path=":userId/edit" element={<UserEdit />} />
      </Route>
      <Route path="/admin/menus" element={<MenuList />} />
      <Route path="/admin/roles" element={<Role />} />
    </Route>
  );

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {publicRoutes}
          {privateRoutes}
          <Route path="/*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default CommonRouter;
