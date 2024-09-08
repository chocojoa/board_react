import DataTable from "@/components/DataTable";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useAxios from "@/hooks/useAxios";
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

const Post = () => {
  const api = useAxios();
  const [data, setData] = useState([]);

  const columns = [
    {
      accessorKey: "rowNumber",
      header: "번호",
      size: 100,
    },
    {
      accessorKey: "title",
      header: "제목",
      size: 400,
    },
    {
      accessorKey: "viewCount",
      header: "조회수",
      size: 100,
    },
    {
      accessorKey: "userName",
      header: "작성자",
      size: 100,
    },
    {
      accessorKey: "createdDate",
      header: "작성일",
      size: 100,
    },
  ];

  const retrievePosts = () => {
    const pageIndex = 0;
    const pageSize = 10;

    api({
      url: `/api/boards/free/posts?pageIndex=${pageIndex}&pageSize=${pageSize}`,
      method: "GET",
    }).then((response) => {
      setData(response.data.data.dataList);
    });
  };

  useEffect(() => {
    retrievePosts();
  }, []);

  return (
    <>
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/">Home</Link>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <Link to="/board">Board</Link>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div>
        <p className="text-lg font-bold">자유게시판</p>
      </div>
      <div className="py-6">
        <DataTable columns={columns} data={data} />
      </div>
    </>
  );
};

export default Post;
