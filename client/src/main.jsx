import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import GlobalChat from "./pages/GlobalChat.jsx";
import UserPage from "./pages/UserPage.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/theme.js";
import "./index.css";
import "./theme/fonts.css";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
	},
	{
		path: "/login",
		element: <Login />,
	},
	{
		path: "/signup",
		element: <SignUp />,
	},
	{
		path: "/GlobalChat",
		element: <GlobalChat />,
	},
	{
		path: "/:id",
		element: <UserPage />,
	},
	{
		path: "*",
		element: <h1>404</h1>,
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<ChakraProvider theme={theme}>
			<RouterProvider router={router} />
		</ChakraProvider>
	</React.StrictMode>
);
