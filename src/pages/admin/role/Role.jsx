import PageHeader from "@/components/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoleList from "./RoleList";
import UserRole from "./UserRole";
import MenuRole from "./MenuRole";

const TAB_ITEMS = [
  { value: "role", label: "권한관리", component: RoleList },
  { value: "menuByRole", label: "권한별 메뉴관리", component: MenuRole },
  { value: "menuByUser", label: "권한별 사용자관리", component: UserRole },
];

const Role = () => {
  const pageTitle = "권한관리";

  return (
    <div className="py-4">
      <PageHeader title={pageTitle} />
      <Tabs defaultValue="role">
        <TabsList className="grid w-full grid-cols-3">
          {TAB_ITEMS.map(({ value, label }) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TAB_ITEMS.map(({ value, component: Component }) => (
          <TabsContent key={value} value={value} className="pt-4">
            <Component />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Role;
