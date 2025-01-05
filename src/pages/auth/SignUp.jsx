import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Baby } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import useAxios from "@/hooks/useAxios";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import UserForm from "@/components/form/UserForm";
import userFormSchema from "@/components/formSchema/UserFormSchema";

const SignUp = () => {
  const navigate = useNavigate();
  const api = useAxios();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(userFormSchema()),
    defaultValues: {
      userName: "",
      email: "",
      password: "",
      verifyPassword: "",
    },
  });

  const handleSignUp = async (formData) => {
    try {
      await api.post("/api/auth/signUp", formData);

      toast({
        title: "계정이 생성되었습니다.",
      });

      navigate("/auth/signIn");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "문제가 발생하였습니다.",
        description: error.response?.data?.message,
      });
    }
  };

  return (
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
          <form
            className="space-y-6"
            onSubmit={form.handleSubmit(handleSignUp)}
          >
            <UserForm form={form} />
            <Button
              type="submit"
              className="flex w-full justify-center rounded-sm font-semibold"
            >
              Create new account
            </Button>
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
  );
};

export default SignUp;
