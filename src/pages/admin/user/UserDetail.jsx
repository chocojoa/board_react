import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import useAxios from "@/hooks/useAxios";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

const UserDetail = () => {
  const pageTitle = "사용자관리";

  const navigate = useNavigate();
  const api = useAxios();

  const { userId } = useParams();
  const [user, setUser] = useState({});
  const location = useLocation();

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

  /**
   * 사용자 조회
   */
  const retrieveUser = () => {
    api({
      url: `/api/admin/users/${userId}`,
      method: "GET",
    }).then((response) => {
      setUser(response.data.data);
    });
  };

  /**
   * 수정화면으로 이동
   */
  const gotoEdit = () => {
    navigate(`/admin/users/${userId}/edit`);
  };

  /**
   * 목록화면으로 이동
   */
  const gotoList = () => {
    navigate(`/admin/users`, { state: location.state });
  };

  useEffect(() => {
    retrieveUser();
    retrieveBreadcrumbs();
  }, []);

  return (
    <div className="py-4">
      {breadcrumbs.length > 0 && (
        <PageHeader title="사용자관리" itemList={breadcrumbs} />
      )}
      <div className="space-y-2 my-2">
        <div className="w-full">
          <span>이름: {user.userName}</span>
        </div>
        <div className="w-full">
          <span>이메일: {user.email}</span>
        </div>
      </div>
      <div className="flex w-full justify-end mt-4">
        <div className="items-end space-x-2">
          <Button type="button" onClick={gotoEdit}>
            수정
          </Button>
          <Button type="button" onClick={gotoList}>
            목록
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
