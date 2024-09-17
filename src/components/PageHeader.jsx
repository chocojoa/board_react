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
      <div>
        <div className="flex items-center text-center">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link to="/">처음</Link>
              </BreadcrumbItem>
              {itemList.map((item) => (
                <Fragment key={item.url}>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <Link to={item.url}>{item.name}</Link>
                  </BreadcrumbItem>
                </Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="py-1">
          <p className="text-lg font-bold">{title}</p>
        </div>
      </div>
    </>
  );
};

export default PageHeader;
