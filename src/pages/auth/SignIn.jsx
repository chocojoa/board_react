import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import authSlice from "@/store/authSlice";
import useAxios from "@/hooks/useAxios";
import { useToast } from "@/hooks/use-toast";

import { Baby } from "lucide-react";

import signInFormSchema from "@/components/formSchema/SignInFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import SignInForm from "@/components/form/SignInForm";
import { Button } from "@/components/ui/button";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const api = useAxios();
  const { toast } = useToast();

  const formSchema = signInFormSchema();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    api({
      url: "/api/auth/signIn",
      method: "POST",
      data,
    })
      .then((response) => {
        dispatch(authSlice.actions.signIn(response.data.data));
        navigate("/");
      })
      .catch((data) => {
        toast({
          variant: "destructive",
          title: "문제가 발생하였습니다.",
          description: data.response.data.message,
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
          <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
              <SignInForm form={form} />
              <div>
                <Button
                  type="submit"
                  className="flex w-full justify-center rounded-sm font-semibold"
                >
                  Sign in
                </Button>
              </div>
            </form>
          </Form>
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
