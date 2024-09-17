import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import useAxios from "@/hooks/useAxios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Baby } from "lucide-react";

import Swal from "sweetalert2";

const SignUp = () => {
  const navigate = useNavigate();
  const api = useAxios();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    api({
      url: "/api/auth/signUp",
      method: "POST",
      data,
    })
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "계정이 생성되었습니다.",
          text: response.data.message,
          timer: 2000,
        }).then(() => {
          navigate("/auth/signIn");
        });
      })
      .catch((data) => {
        Swal.fire({
          icon: "error",
          title: "문제가 발생하였습니다.",
          text: data.message,
          timer: 2000,
        });
      });
  };

  return (
    <>
      <div className="flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <div className="flex justify-center">
            <Baby size={40} />
          </div>
          <h2 className="mt-2 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create new account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <Label htmlFor="userName">Name</Label>
              <div className="mt-2">
                <Input
                  id="userName"
                  type="text"
                  {...register("userName", {
                    required: "Name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3",
                    },
                  })}
                  className="block w-full rounded-md py-1.5 px-2"
                />
                {errors.userName && (
                  <span className="text-sm font-medium text-red-500">
                    {errors.userName.message}
                  </span>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-2">
                <Input
                  id="email"
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    minLength: {
                      value: 6,
                      message: "Email must be at least 6",
                    },
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className="block w-full rounded-md py-1.5 px-2"
                />
                {errors.email && (
                  <span className="text-sm font-medium text-red-500">
                    {errors.email.message}
                  </span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
              </div>
              <div className="mt-2">
                <Input
                  id="password"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8",
                    },
                  })}
                  autoComplete="current-password"
                  className="block w-full rounded-md py-1.5 px-2"
                />
                {errors.password && (
                  <span className="text-sm font-medium text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>
            </div>

            <div>
              <Button
                type="submit"
                className="flex w-full justify-center rounded-sm font-semibold"
              >
                Create new account
              </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm">
            Already have account?{" "}
            <Link to="/auth/signIn" className="font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignUp;
