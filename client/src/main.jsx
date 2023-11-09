import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home.jsx";
import SignUp from "./pages/SignUp.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import GlobalChat from "./pages/GlobalChat.jsx";
import UserPage from "./pages/UserPage.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme/theme.js";
import "./index.css";
import "./theme/fonts.css";

// Create a router using the createBrowserRouter function.
const router = createBrowserRouter([
	{
		path: "/",
		element: <Home />,
	},
	{
		path: "/login",
		element: <LoginPage />,
	},
	{
		path: "/signup",
		element: <SignUp />,
	},
	{
		path: "/globalchat",
		element: <GlobalChat />,
	},
	// Need to fix this so that this route is only accessible if the user is logged in
	{
		path: "/user/:id",
		element: <UserPage />,
	},
	{
		path: "*",
		element: <h1>404</h1>,
	},
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		{/* Chakra Provider */}
		<ChakraProvider theme={theme}>
			{/* Router Provider */}
			<RouterProvider router={router} />
		</ChakraProvider>
	</React.StrictMode>
);
