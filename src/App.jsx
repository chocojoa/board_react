import { Provider } from "react-redux";
import CommonRouter from "./routes/CommonRouter";
import store, { persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <CommonRouter />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
