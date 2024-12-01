import { useEffect, useState } from "react";
import useAxios from "@/hooks/useAxios";

import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoleList from "./RoleList";
import UserRole from "./UserRole";
import MenuRole from "./MenuRole";

const Role = () => {
  const pageTitle = "권한관리";

  const api = useAxios();

  const [breadcrumbs, setBreadcrumbs] = useState([]);

  /**
   * 네비게이션 조회
   */
  const retrieveBreadcrumbs = () => {
    const url = `/api/admin/menus/breadcrumbs?menuName=${pageTitle}`;
    api({
      url: encodeURI(url),
      method: "GET",
    }).then((response) => {
      setBreadcrumbs(response.data.data);
    });
  };

  useEffect(() => {
    retrieveBreadcrumbs();
  }, []);

  return (
    <div className="py-4">
      {breadcrumbs.length > 0 && (
        <PageHeader title={pageTitle} itemList={breadcrumbs} />
      )}
      <Tabs defaultValue="role">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="role">권한관리</TabsTrigger>
          <TabsTrigger value="menuByRole">권한별 메뉴관리</TabsTrigger>
          <TabsTrigger value="menuByUser">권한별 사용자관리</TabsTrigger>
        </TabsList>
        <TabsContent value="role" className="pt-4">
          <RoleList />
        </TabsContent>
        <TabsContent value="menuByRole" className="pt-4">
          <MenuRole />
        </TabsContent>
        <TabsContent value="menuByUser" className="pt-4">
          <UserRole />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Role;
