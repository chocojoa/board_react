import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Baby } from "lucide-react";
import Swal from "sweetalert2";
import { zodResolver } from "@hookform/resolvers/zod";

import useAxios from "@/hooks/useAxios";

import { Button } from "@/components/ui/button";
import UserForm from "@/components/form/UserForm";
import userFormSchema from "@/components/formSchema/UserFormSchema";
import { Form } from "@/components/ui/form";

const SignUp = () => {
  const navigate = useNavigate();
  const api = useAxios();

  const formSchema = userFormSchema();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      verifyPassword: "",
    },
  });

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
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <UserForm form={form} />
              <div>
                <Button
                  type="submit"
                  className="flex w-full justify-center rounded-sm font-semibold"
                >
                  Create new account
                </Button>
              </div>
            </form>
          </Form>
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
