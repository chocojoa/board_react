import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import useAxios from "@/hooks/useAxios";

import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";

const UserDetail = () => {
  const pageTitle = "사용자관리";
  const navigate = useNavigate();
  const api = useAxios();
  const { userId } = useParams();
  const location = useLocation();

  const [user, setUser] = useState({});

  const retrieveUser = async () => {
    try {
      const { data } = await api.get(`/api/admin/users/${userId}`);
      setUser(data.data);
    } catch (error) {
      toast.error("사용자 정보 조회 중 문제가 발생하였습니다.", {
        description: error.response?.data?.message,
      });
    }
  };

  const handleEdit = () => {
    navigate(`/admin/users/${userId}/edit`);
  };

  const handleList = () => {
    navigate("/admin/users", { state: location.state });
  };

  useEffect(() => {
    retrieveUser();
  }, []);

  return (
    <div className="py-4">
      <PageHeader title={pageTitle} />
      <div className="border rounded-md mt-2">
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center w-full">
              <span className="font-medium w-24">이름</span>
              <span>{user.userName}</span>
            </div>
            <div className="flex items-center w-full">
              <span className="font-medium w-24">이메일</span>
              <span>{user.email}</span>
            </div>
            <div className="flex justify-end space-x-2">
              <Button onClick={handleEdit}>수정</Button>
              <Button onClick={handleList}>목록</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetail;
