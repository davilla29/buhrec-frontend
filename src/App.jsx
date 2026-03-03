import { Toaster } from "react-hot-toast";
import { routes } from "./routes/routes";
import useCheckAuthInit from "./hooks/auth/useCheckAuthInit";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter(routes);

function App() {
  useCheckAuthInit();

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
