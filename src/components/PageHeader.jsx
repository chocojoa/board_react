import { Link } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import { Fragment } from "react";

const PageHeader = ({ title, itemList }) => {
  return (
    <>
      <div className="flex items-center text-center mb-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <Link to="/">처음</Link>
            </BreadcrumbItem>
            {itemList.map((item) => (
              <Fragment key={item.menuId}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <Link to={item.menuUrl}>{item.menuName}</Link>
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="py-1">
        <p className="text-lg font-bold">{title}</p>
      </div>
    </>
  );
};

export default PageHeader;
