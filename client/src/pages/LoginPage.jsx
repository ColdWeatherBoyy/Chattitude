import { Box, Heading, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import BrandButton from "../components/BrandButton.jsx";
import Header from "../components/Header.jsx";

function LoginPage() {
	// ******************************************************
	// ****************  Login States *******************
	// ******************************************************
	const [emailInput, setEmailInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [invalidEmail, setInvalidEmail] = useState(false);

	// ******************************************************
	// *************  Conditional Error Values **************
	// ******************************************************
	let emailMessage = emailError ? "Email is required" : "";
	let passwordMessage = passwordError ? "Password is required" : "";
	let invalidEmailMessage = invalidEmail ? "Entered value is not a valid email" : "";

	// Email Regex Pattern
	const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	// ******************************************************
	// ****************  Login Functions *********************
	// ******************************************************

	// Fetch function to send login data to server
	const login = async () => {
		try {
			const response = await fetch("/api/user/post/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					email: emailInput,
					password: passwordInput,
				}),
			});
			console.log(response);
			if (response.ok) {
				// If successful, redirects to chat
				window.location.href = "/globalchat";
			} else {
				const errorData = await response.json();
				// Alert on error logging in
				alert(errorData.error);
			}
		} catch (error) {
			console.log(error);
		}
	};

	// Function to handle log in
	const handleLogin = async () => {
		// Error checks for empty fields and invalid email
		const emailInputErrorCheck = emailInput.trim() === "";
		const passwordInputErrorCheck = passwordInput.trim() === "";
		const invalidEmailCheck = !emailPattern.test(emailInput);

		// Sets error states
		setEmailError(emailInputErrorCheck);
		setPasswordError(passwordInputErrorCheck);
		if (!emailInputErrorCheck) {
			setInvalidEmail(invalidEmailCheck);
		}

		if (!emailInputErrorCheck && !passwordInputErrorCheck && !invalidEmailCheck) {
			await login();
		}
	};

	// Functions to update email and password states
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
				<FormControl
					bgColor="white"
					w="50%"
					p={5}
					m={5}
					borderRadius={5}
					onKeyUp={(event) => {
						if (event.key === "Enter") handleLogin();
					}}
				>
					<FormLabel>Email</FormLabel>
					<Input
						type="email"
						placeholder="Email"
						onChange={updateEmail}
						onBlur={updateEmail}
						isInvalid={emailError || invalidEmail}
						id="emailInput"
					/>
					{/* Error messages for emails */}
					<Text pb={3} color="red.600">
						{emailMessage} {invalidEmailMessage}
					</Text>
					<FormLabel>Password</FormLabel>
					<Input
						type="password"
						placeholder="Password"
						onChange={updatePassword}
						onBlur={updatePassword}
						isInvalid={passwordError}
						id="passwordInput"
					/>
					{/* Error message for passwords */}
					<Text pb={3} color="red.600">
						{passwordMessage}
					</Text>
				</FormControl>
				<BrandButton onClick={handleLogin}>Log In</BrandButton>
			</Box>
		</>
	);
}

export default LoginPage;
