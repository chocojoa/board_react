import { Provider } from "react-redux";
import CommonRouter from "./routes/CommonRouter";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <CommonRouter />
        </PersistGate>
      </Provider>
      <Toaster />
    </>
  );
}

export default App;
