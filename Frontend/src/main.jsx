import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { createRoot } from "react-dom/client";
import { BrowserRouter, createBrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx"

// const router = createBrowserRouter({
//   path: "/",
//   element: <App />,
//   children: [  {
//         path: "/",
//         element: <Home />,
//       },  {
//         path: "/products",
//         element: <Home />,
//       },  {
//         path: "/products/:id",
//         element: <Home />,
//       },
//       {
//         path: "/cart",
//         element: <Home />,
//       },
//       {
//         path: "/checkout",
//         element: <Home />,
//       },  {
//         path: "/login",
//         element: <Home />,

//       },  {
//         path: "/register",
//         element: <Home />,
//       },  {
//         path: "/profile",
//         element: <Home />,
//       },
//       {
//         path: "/orders",
//         element: <Home />,
//       },],
// });

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
