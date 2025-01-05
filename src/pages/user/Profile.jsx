import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "@/hooks/use-toast";
import useAxios from "@/hooks/useAxios";

import UserForm from "@/components/form/UserForm";
import userFormSchema from "@/components/formSchema/UserFormSchema";
import PageHeader from "@/components/PageHeader";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

const Profile = () => {
  const user = useSelector((state) => state.auth.user);
  const api = useAxios();
  const { toast } = useToast();

  const form = useForm({
    resolver: zodResolver(userFormSchema()),
    defaultValues: {
      userName: user.userName,
      email: user.email,
      password: "",
      verifyPassword: "",
    },
  });

  const handleUpdateProfile = async (formData) => {
    try {
      await api.put(`/api/common/profile/${user.userId}`, {
        ...formData,
        modifiedBy: user.userId,
      });

      toast({
        title: "수정되었습니다.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "문제가 발생하였습니다.",
        description: error.response?.data?.message,
      });
    }
  };

  return (
    <div className="py-4">
      <PageHeader
        title="Profile"
        breadcrumbs={[
          { menuId: "profile", menuName: "Profile", menuUrl: "/user/profile" },
        ]}
      />
      <div className="mt-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleUpdateProfile)}
            className="space-y-6"
          >
            <UserForm form={form} />
            <div className="flex w-full justify-end mt-4">
              <div className="items-end space-x-2">
                <Button type="submit">저장</Button>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Profile;
