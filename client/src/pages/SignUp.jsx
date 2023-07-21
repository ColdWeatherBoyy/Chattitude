import { Box, Heading, FormControl, FormLabel, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import Header from "../components/Header.jsx";
import BrandButton from "../components/BrandButton.jsx";

function SignUp() {
	const [firstNameInput, setFirstNameInput] = useState(" ");
	const [lastNameInput, setLastNameInput] = useState(" ");
	const [emailInput, setEmailInput] = useState(" ");
	const [passwordInput, setPasswordInput] = useState(" ");
	const [confirmInput, setConfirmInput] = useState(" ");
	const [emailError, setEmailError] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [confirmError, setConfirmError] = useState(false);
	const [firstNameError, setFirstNameError] = useState(false);
	const [lastNameError, setLastNameError] = useState(false);

	let emailMessage = emailError ? "Email is required" : "";
	let passwordMessage = passwordError ? "Password is required" : "";
	let confirmMessage = confirmError ? "Confirmation is required" : "";
	let firstNameMessage = firstNameError ? "First name is required" : "";
	let lastNameMessage = lastNameError ? "Last name is required" : "";

	const signIn = () => {
		setEmailError(false);
		setPasswordError(false);
		setConfirmError(false);
		setFirstNameError(false);
		setLastNameError(false);

		if (emailInput.trim() === "") {
			setEmailError(true);
		}
		if (passwordInput.trim() === "") {
			setPasswordError(true);
		}
		if (confirmInput.trim() === "") {
			setConfirmError(true);
		}
		if (firstNameInput.trim() === "") {
			setFirstNameError(true);
		}
		if (lastNameInput.trim() === "") {
			setLastNameError(true);
		}
		console.log("sign in attempt");
		console.log("First Name: " + firstNameInput);
		console.log("Last Name: " + lastNameInput);
		console.log("Email: " + emailInput);
		console.log("Password: " + passwordInput);
		console.log("Password Confirmation: " + confirmInput);
	};

	const updateEmail = (event) => {
		setEmailInput(event.currentTarget.value);
	};

	const updatePassword = (event) => {
		setPasswordInput(event.currentTarget.value);
	};

	const updateConfirm = (event) => {
		setConfirmInput(event.currentTarget.value);
	};

	const updateFirstName = (event) => {
		setFirstNameInput(event.currentTarget.value);
	};

	const updateLastName = (event) => {
		setLastNameInput(event.currentTarget.value);
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
				<Heading my={5}>Sign Up</Heading>
				<FormControl bgColor="white" w="50%" p={5} m={5} borderRadius={5}>
					<FormLabel>First Name</FormLabel>
					<Input
						placeholder="First Name"
						onChange={updateFirstName}
						onBlur={updateFirstName}
						isInvalid={firstNameError}
					/>
					<Text pb={3} color="red.600">
						{firstNameMessage}
					</Text>
					<FormLabel>Last Name</FormLabel>
					<Input
						placeholder="Last Name"
						onChange={updateLastName}
						onBlur={updateLastName}
						isInvalid={lastNameError}
					/>
					<Text pb={3} color="red.600">
						{lastNameMessage}
					</Text>
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
					<FormLabel>Confirm Password</FormLabel>
					<Input
						type="password"
						placeholder="Confirm Password"
						onChange={updateConfirm}
						onBlur={updateConfirm}
						isInvalid={confirmError}
					/>
					<Text pb={3} color="red.600">
						{confirmMessage}
					</Text>
				</FormControl>
				<BrandButton onClick={signIn}>Sign Up</BrandButton>
			</Box>
		</>
	);
}

export default SignUp;
