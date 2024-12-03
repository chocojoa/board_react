import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";

const MenuForm = ({ form }) => {
  return (
    <>
      <FormField
        control={form.control}
        name="menuId"
        className="hidden"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input type="hidden" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="parentMenuId"
        className="hidden"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input type="hidden" {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="menuName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>메뉴명</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="menuUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>URL</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="sortOrder"
        render={({ field }) => (
          <FormItem>
            <FormLabel>정렬순서</FormLabel>
            <FormControl>
              <Input
                type="number"
                {...field}
                onChange={(event) => field.onChange(Number(event.target.value))}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="icon"
        render={({ field }) => (
          <FormItem>
            <FormLabel>아이콘</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
            <FormDescription>
              아이콘은{" "}
              <a href="https://lucide.dev" target="_blank">
                Lucide
              </a>
              사이트에 접속하여 icon을 검색하여 입력하면 됩니다.
            </FormDescription>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="usageStatus"
        render={({ field }) => (
          <FormItem className="space-x-4">
            <FormLabel>사용여부</FormLabel>
            <FormControl>
              <Switch
                value={field.value}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default MenuForm;
