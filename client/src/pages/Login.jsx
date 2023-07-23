import { Box, Heading, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import BrandButton from "../components/BrandButton.jsx";
import Header from "../components/Header.jsx";

function Login() {
	const [emailInput, setEmailInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [makeFetch, setMakeFetch] = useState(false);
	const [invalidEmail, setInvalidEmail] = useState(false);

	let emailMessage = emailError ? "Email is required" : "";
	let passwordMessage = passwordError ? "Password is required" : "";
	let invalidEmailMessage = invalidEmail ? "Entered value is not a valid email" : "";

	const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	async function fetchData() {
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
			if (response.ok) {
				const data = await response.json();
				// store token in cookies
				document.cookie = `token=${data.token}`;
				// redirect to messages
				window.location.href = "/websockettest";
			} else {
				const errorData = await response.json();
				alert(errorData.error);
			}
		} catch (error) {
			console.log(error);
		}
	}

	const logIn = async () => {
		console.log("sign in attempt");
		console.log("Email: " + emailInput);
		console.log("Password: " + passwordInput);

		const emailInputErrorCheck = emailInput.trim() === "";
		const passwordInputErrorCheck = passwordInput.trim() === "";
		const invalidEmailCheck = !emailPattern.test(emailInput);

		setEmailError(emailInputErrorCheck);
		setPasswordError(passwordInputErrorCheck);
		if (!emailInputErrorCheck) {
			setInvalidEmail(invalidEmailCheck);
		}

		if (!emailInputErrorCheck && !passwordInputErrorCheck && !invalidEmailCheck) {
			setMakeFetch(true);
		}
	};

	useEffect(() => {
		if (makeFetch) {
			fetchData();
			setMakeFetch(false);
		}
	}, [makeFetch]);

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
						type="email"
						placeholder="Email"
						onChange={updateEmail}
						onBlur={updateEmail}
						isInvalid={emailError || invalidEmail}
						id="emailInput"
					/>
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
					<Text pb={3} color="red.600">
						{passwordMessage}
					</Text>
				</FormControl>
				<BrandButton onClick={logIn}>Log In</BrandButton>
			</Box>
		</>
	);
}

export default Login;
