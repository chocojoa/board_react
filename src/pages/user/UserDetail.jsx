import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import useAxios from "@/hooks/useAxios";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

const UserDetail = () => {
  const navigate = useNavigate();
  const api = useAxios();

  const { userId } = useParams();
  const [user, setUser] = useState({});
  const location = useLocation();

  const breadCrumbList = [{ url: `/users`, name: "사용자" }];

  const gotoEdit = () => {
    navigate(`/users/${userId}/edit`);
  };

  const gotoList = () => {
    navigate(`/users`, { state: location.state });
  };

  const retrieveUser = () => {
    api({
      url: `/api/users/${userId}`,
      method: "GET",
    }).then((response) => {
      setUser(response.data.data);
    });
  };

  useEffect(() => {
    retrieveUser();
  }, []);

  return (
    <>
      <PageHeader title="사용자" itemList={breadCrumbList} />
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
    </>
  );
};

export default UserDetail;
