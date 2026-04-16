import CommonRouter from "./routes/CommonRouter";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <>
      <CommonRouter />
      <Toaster richColors />
    </>
  );
}

export default App;
