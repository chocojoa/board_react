import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="flex h-screen">
        <div className="py-8 px-4 m-auto max-w-screen-xl lg:py-16 lg:px-6">
          <div className="mx-auto max-w-screen-sm text-center">
            <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">
              404
            </h1>
            <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
              죄송합니다. 페이지를 찾을 수 없습니다.
            </p>
            <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
              존재하지 않는 주소를 입력하셨거나,
              <br />
              요청하신 주소가 변경, 삭제되어 찾을 수 없습니다.
            </p>

            <Button>
              <Link
                to="/"
                className="inline-flex text-white bg-primary-600 hover:bg-primary-800 font-medium rounded-lg text-sm text-center dark:focus:ring-primary-900 my-4"
              >
                홈페이지로 이동
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NotFound;
