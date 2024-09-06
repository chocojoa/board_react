import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import useAxios from "@/hooks/useAxios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Board = () => {
  const api = useAxios();

  const [board, setBoard] = useState({});

  const retrieveBoard = () => {
    api({
      url: "/api/board?category=board&boardId=1",
      method: "GET",
    }).then((response) => {
      setBoard(response.data);
    });
  };

  useEffect(() => {
    retrieveBoard();
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
        <p className="text-lg font-bold">Board</p>
      </div>
      <div className="py-6">
        Board ID : {board.boardId} / Board Title : {board.title}
      </div>
    </>
  );
};

export default Board;
