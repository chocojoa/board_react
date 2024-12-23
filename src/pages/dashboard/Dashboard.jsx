import PageHeader from "@/components/PageHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  XAxis,
} from "recharts";

const Dashboard = () => {
  const pageTitle = "대시보드";

  const chartData = [
    { month: "January", desktop: 186, mobile: 80 },
    { month: "February", desktop: 305, mobile: 200 },
    { month: "March", desktop: 237, mobile: 120 },
    { month: "April", desktop: 73, mobile: 190 },
    { month: "May", desktop: 209, mobile: 130 },
    { month: "June", desktop: 214, mobile: 140 },
  ];

  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "black",
    },
    mobile: {
      label: "Mobile",
      color: "gray",
    },
  };

  return (
    <div className="my-4">
      <PageHeader title={pageTitle} />
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>가입자 수</CardTitle>
          </CardHeader>
          <CardContent>가입자 수</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>가입자 수</CardTitle>
          </CardHeader>
          <CardContent>가입자 수</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>가입자 수</CardTitle>
          </CardHeader>
          <CardContent>가입자 수</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>가입자 수</CardTitle>
          </CardHeader>
          <CardContent>가입자 수</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>차트 #1</CardTitle>
            <CardDescription>Bar Chart</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[200px]">
              <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
                <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>차트 #2</CardTitle>
            <CardDescription>Line Chart</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[200px]">
              <LineChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Line
                  dataKey="desktop"
                  stroke="var(--color-desktop)"
                  radius={4}
                />
                <Line
                  dataKey="mobile"
                  stroke="var(--color-mobile)"
                  radius={4}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>차트 #3</CardTitle>
            <CardDescription>Pie Chart</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[200px]">
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Pie
                  data={chartData}
                  dataKey="desktop"
                  nameKey="month"
                  cx="50%"
                  cy="50%"
                  outerRadius={50}
                  fill="var(--color-desktop)"
                />
                <Pie
                  data={chartData}
                  dataKey="mobile"
                  nameKey="month"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="var(--color-mobile)"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>차트 #4</CardTitle>
            <CardDescription>Radar Chart</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="w-full h-[200px]">
              <RadarChart>
                <ChartTooltip content={<ChartTooltipContent />} />
                <PolarGrid />
                <PolarAngleAxis dataKey="month" />
                <PolarRadiusAxis angle={30} />
                <Radar
                  dataKey="desktop"
                  fill="var(--color-desktop)"
                  fillOpacity={0.6}
                />
                <Radar
                  dataKey="mobile"
                  fill="var(--color-mobile)"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
