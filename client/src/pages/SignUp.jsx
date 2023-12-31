import {
	Box,
	Heading,
	FormControl,
	FormLabel,
	Input,
	Text,
	useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import Header from "../components/Header.jsx";
import BrandButton from "../components/BrandButton.jsx";

function SignUp() {
	// ******************************************************
	// ****************  SignUp States **********************
	// ******************************************************
	const [firstNameInput, setFirstNameInput] = useState("");
	const [lastNameInput, setLastNameInput] = useState("");
	const [emailInput, setEmailInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");
	const [confirmInput, setConfirmInput] = useState("");
	const [emailError, setEmailError] = useState(false);
	const [invalidEmail, setInvalidEmail] = useState(false);
	const [passwordError, setPasswordError] = useState(false);
	const [confirmError, setConfirmError] = useState(false);
	const [matchError, setMatchError] = useState(false);
	const [firstNameError, setFirstNameError] = useState(false);
	const [lastNameError, setLastNameError] = useState(false);

	// ******************************************************
	// ****************  Toast Hook *************************
	// ******************************************************
	const toast = useToast();

	// ******************************************************
	// *************  Conditional Error Values **************
	// ******************************************************
	let emailMessage = emailError ? "Email is required" : "";
	let invalidEmailMessage = invalidEmail ? "Entered value is not a valid email" : "";
	let passwordMessage = passwordError ? "Password is required" : "";
	let confirmMessage = confirmError ? "Confirmation is required" : "";
	let matchMessage = matchError ? "Passwords do not match" : "";
	let firstNameMessage = firstNameError ? "First name is required" : "";
	let lastNameMessage = lastNameError ? "Last name is required" : "";

	// Email Regex Pattern
	const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	// ******************************************************
	// ****************  SignUp Functions *******************
	// ******************************************************

	// Fetch function to send sin up data to server
	const createAccount = async () => {
		try {
			const response = await fetch("/api/user/post/create", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					first_name: firstNameInput,
					last_name: lastNameInput,
					email: emailInput,
					password: passwordInput,
				}),
			});
			if (response.ok) {
				toast({
					title: "Account Created",
					description: "You will be redirected to the chat.",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
				setTimeout(() => {
					window.location.href = "/globalchat";
				}, 750);
			} else {
				const errorData = await response.json();
				if (errorData.error.code === 11000) {
					toast({
						title: "Error Signing In",
						description: "Email is already associated with an active account.",
						status: "error",
						duration: 3000,
						isClosable: true,
					});
				} else if (errorData.error.name === "ValidationError") {
					toast({
						title: "Error Signing In.",
						description:
							"Password must be at least 8 characters long and contain one lowercase letter, one uppercase letter, one number, and one special character.",
						status: "error",
						duration: 3000,
						isClosable: true,
					});
				}
			}
		} catch (error) {
			console.log("catch-block error: ", error);
		}
	};

	// Function to handle sign up
	const handleSignUp = async () => {
		const emailInputErrorCheck = emailInput.trim() === "";
		const invalidEmailCheck = !emailPattern.test(emailInput);
		const passwordInputErrorCheck = passwordInput.trim() === "";
		const confirmInputErrorCheck = confirmInput.trim() === "";
		const firstNameInputErrorCheck = firstNameInput.trim() === "";
		const lastNameInputErrorCheck = lastNameInput.trim() === "";
		const passwordMatchErrorCheck =
			passwordInput.trim() !== confirmInput.trim() && confirmInput.trim() !== "";

		setEmailError(emailInputErrorCheck);
		setPasswordError(passwordInputErrorCheck);
		setConfirmError(confirmInputErrorCheck);
		setFirstNameError(firstNameInputErrorCheck);
		setLastNameError(lastNameInputErrorCheck);
		setMatchError(passwordMatchErrorCheck);
		if (!emailInputErrorCheck) {
			setInvalidEmail(invalidEmailCheck);
		}
		if (
			!emailInputErrorCheck &&
			!passwordInputErrorCheck &&
			!confirmInputErrorCheck &&
			!firstNameInputErrorCheck &&
			!lastNameInputErrorCheck &&
			!passwordMatchErrorCheck &&
			!invalidEmailCheck
		) {
			await createAccount();
		}
	};

	// Functions to update user account states
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
				<FormControl
					bgColor="white"
					w="50%"
					p={5}
					m={5}
					borderRadius={5}
					onKeyUp={(event) => {
						if (event.key === "Enter") handleSignUp();
					}}
				>
					<FormLabel>First Name</FormLabel>
					<Input
						placeholder="First Name"
						onChange={updateFirstName}
						onBlur={updateFirstName}
						isInvalid={firstNameError}
						id="firstName"
					/>
					{/* Error messages for first name */}
					<Text pb={3} color="red.600">
						{firstNameMessage}
					</Text>
					<FormLabel>Last Name</FormLabel>
					<Input
						placeholder="Last Name"
						onChange={updateLastName}
						onBlur={updateLastName}
						isInvalid={lastNameError}
						id="lastName"
					/>
					{/* Error messages for last name */}
					<Text pb={3} color="red.600">
						{lastNameMessage}
					</Text>
					<FormLabel>Email</FormLabel>
					<Input
						placeholder="Email"
						onChange={updateEmail}
						onBlur={updateEmail}
						isInvalid={emailError || invalidEmail}
						id="email"
					/>
					{/* Error messages for email */}
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
						id="password"
					/>
					{/* Error messages for password */}
					<Text pb={3} color="red.600">
						{passwordMessage}
					</Text>
					<FormLabel>Confirm Password</FormLabel>
					<Input
						type="password"
						placeholder="Confirm Password"
						onChange={updateConfirm}
						onBlur={updateConfirm}
						isInvalid={confirmError || matchError}
						id="passwordConfirm"
					/>
					{/* Error messages for confirmation password */}
					<Text pb={3} color="red.600">
						{confirmMessage} {matchMessage}
					</Text>
				</FormControl>
				<BrandButton onClick={handleSignUp}>Sign Up</BrandButton>
			</Box>
		</>
	);
}

export default SignUp;
