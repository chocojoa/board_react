import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Fragment, useEffect, useState } from "react";
import useAxios from "@/hooks/useAxios";

const PageHeader = ({ title }) => {
  const api = useAxios();
  const [breadcrumbs, setBreadcrumbs] = useState([]);

  const fetchBreadcrumbs = async () => {
    try {
      const { data } = await api({
        url: encodeURI(`/api/admin/menus/breadcrumbs?menuName=${title}`),
        method: "GET",
      });
      setBreadcrumbs(data.data);
    } catch (error) {
      console.error("브레드크럼 조회 실패:", error);
    }
  };

  useEffect(() => {
    fetchBreadcrumbs();
  }, [title]);

  const renderBreadcrumbItem = (item) => (
    <Fragment key={item.menuId}>
      <BreadcrumbSeparator />
      <BreadcrumbItem>
        <Link to={item.menuUrl}>{item.menuName}</Link>
      </BreadcrumbItem>
    </Fragment>
  );

  return (
    <>
      <nav className="flex items-center text-center mb-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/">처음</Link>
            </BreadcrumbItem>
            {breadcrumbs.map(renderBreadcrumbItem)}
          </BreadcrumbList>
        </Breadcrumb>
      </nav>
      <header className="py-1">
        <h1 className="text-lg font-bold">{title}</h1>
      </header>
    </>
  );
};

export default PageHeader;
