import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
      <div className="mx-auto max-w-screen-md px-4 text-center">
        <h1 className="mb-4 text-7xl font-extrabold tracking-tight text-primary-600 dark:text-primary-500 lg:text-9xl">
          404
        </h1>
        <h2 className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
          죄송합니다. 페이지를 찾을 수 없습니다.
        </h2>
        <p className="mb-8 text-lg font-light text-gray-500 dark:text-gray-400">
          존재하지 않는 주소를 입력하셨거나,
          <br />
          요청하신 주소가 변경, 삭제되어 찾을 수 없습니다.
        </p>
        <Link to="/">
          <Button>홈페이지로 이동</Button>
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
