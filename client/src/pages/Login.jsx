import { Box, Heading, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import BrandButton from "../components/BrandButton.jsx";
import Header from "../components/Header.jsx";
import { set } from "mongoose";

function Login() {
	const [emailInput, setEmailInput] = useState(" ");
	const [passwordInput, setPasswordInput] = useState(" ");
	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	let emailMessage = emailError ? "Email is required" : "";
	let passwordMessage = passwordError ? "Password is required" : "";

	const signIn = async () => {
		setEmailError(false);
		setPasswordError(false);

		if (emailInput.trim() === "") {
			setEmailError(true);
		}
		if (passwordInput.trim() === "") {
			setPasswordError(true);
		}

		console.log("sign in attempt");
		console.log("Email: " + emailInput);
		console.log("Password: " + passwordInput);

		// connect to api route
		// if successful, redirect to home page
		// if not, display error message
		// const response = await fetch("/api/user/post/login", {
		// 	method: "POST",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 	},
		// 	body: JSON.stringify({
		// 		email: emailInput,
		// 		password: passwordInput,
		// 	}),
		// });
		// const data = await response.json();
	};

	const updateEmail = (event) => {
		setEmailInput(event.currentTarget.value);
	};

	const updatePassword = (event) => {
		setPasswordInput(event.currentTarget.value);
	};

	return (
		<>
			<Box
				w="100vw"
				h="100vh"
				bgColor="gray.200"
				display="flex"
				flexDirection="column"
				alignItems="center"
			>
				<Header />
				<Heading my={5}>Login</Heading>
				<FormControl bgColor="white" w="50%" p={5} m={5} borderRadius={5}>
					<FormLabel>Email</FormLabel>
					<Input
						placeholder="Email"
						onChange={updateEmail}
						onBlur={updateEmail}
						isInvalid={emailError}
					/>
					<Text pb={3} color="red.600">
						{emailMessage}
					</Text>
					<FormLabel>Password</FormLabel>
					<Input
						type="password"
						placeholder="Password"
						onChange={updatePassword}
						onBlur={updatePassword}
						isInvalid={passwordError}
					/>
					<Text pb={3} color="red.600">
						{passwordMessage}
					</Text>
				</FormControl>
				<BrandButton onClick={signIn}>Log In</BrandButton>
			</Box>
		</>
	);
}

export default Login;
