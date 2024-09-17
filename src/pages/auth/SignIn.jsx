import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import authSlice from "@/store/authSlice";
import useAxios from "@/hooks/useAxios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Baby } from "lucide-react";

import Swal from "sweetalert2";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const api = useAxios();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    api({
      url: "/api/auth/login",
      method: "POST",
      data,
    })
      .then((response) => {
        dispatch(authSlice.actions.signIn(response.data.data));
        navigate("/");
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
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
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
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-gray-600 hover:text-gray-500"
                  >
                    Forgot password?
                  </a>
                </div>
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
                Sign in
              </Button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm">
            Don&apos;t have account yet?{" "}
            <Link to="/auth/signUp" className="font-semibold">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignIn;
