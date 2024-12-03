import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import { useToast } from "@/hooks/use-toast";
import useAxios from "@/hooks/useAxios";
import { zodResolver } from "@hookform/resolvers/zod";

import UserForm from "@/components/form/UserForm";
import userFormSchema from "@/components/formSchema/UserFormSchema";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);

  const api = useAxios();
  const { toast } = useToast();

  const formSchema = userFormSchema();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userName: user.userName,
      email: user.email,
      password: "",
      verifyPassword: "",
    },
  });

  const onSubmit = (data) => {
    api({
      url: `/api/common/profile/${user.userId}`,
      method: "PUT",
      data: {
        userName: data.userName,
        email: data.email,
        password: data.password,
        verifyPassword: data.verifyPassword,
        modifiedBy: user.userId,
      },
    })
      .then(() => {
        toast({
          title: "수정되었습니다.",
        });
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
      <div className="my-4">
        <div className="flex items-center text-center mb-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <Link to="/">처음</Link>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Link to="/user/profile">Profile</Link>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="py-1">
          <p className="text-lg font-bold">Profile</p>
        </div>
      </div>
      <div className="mt-2">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <UserForm form={form} />
            <div className="flex w-full justify-end mt-4">
              <div className="items-end space-x-2">
                <Button type="submit">저장</Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default Profile;
