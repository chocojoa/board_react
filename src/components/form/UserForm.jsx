import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import PasswordInput from "../ui/password-input";

const UserForm = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="userName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>이름</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>이메일 주소</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>비밀번호</FormLabel>
            <FormControl>
              <PasswordInput {...field} />
            </FormControl>
            <FormMessage />
            <FormDescription>영문+숫자+특수문자 (8~15자리)</FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="verifyPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>비밀번호 확인</FormLabel>
            <FormControl>
              <PasswordInput {...field} />
            </FormControl>
            <FormMessage />
            <FormDescription>영문+숫자+특수문자 (8~15자리)</FormDescription>
          </FormItem>
        )}
      />
    </>
  );
};

export default UserForm;
