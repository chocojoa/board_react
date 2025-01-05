import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Baby } from "lucide-react";

import authSlice from "@/store/authSlice";
import menuSlice from "@/store/menuSlice";
import useAxios from "@/hooks/useAxios";
import { useToast } from "@/hooks/use-toast";
import signInFormSchema from "@/components/formSchema/SignInFormSchema";
import { Form } from "@/components/ui/form";
import SignInForm from "@/components/form/SignInForm";
import { Button } from "@/components/ui/button";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const api = useAxios();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(signInFormSchema()),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (response) => {
    const { token, user } = response.data.data;
    dispatch(authSlice.actions.signIn(response.data.data));
    await retrieveUserMenuList(token.accessToken, user.userId);
  };

  const retrieveUserMenuList = async (accessToken, userId) => {
    try {
      const response = await api({
        url: `/api/common/userMenu/${userId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      dispatch(menuSlice.actions.setUserMenu(response.data.data));
      navigate("/");
    } catch (error) {
      showErrorToast(error);
    }
  };

  const showErrorToast = (error) => {
    toast({
      variant: "destructive",
      title: "문제가 발생하였습니다.",
      description: error.response?.data?.message,
    });
  };

  const onSubmit = async (data) => {
    try {
      const response = await api({
        url: "/api/auth/signIn",
        method: "POST",
        data,
      });
      await handleSignIn(response);
    } catch (error) {
      showErrorToast(error);
    }
  };

  return (
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
  );
};

export default SignIn;
