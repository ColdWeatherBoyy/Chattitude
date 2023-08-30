import {
	Box,
	Flex,
	Heading,
	FormControl,
	FormLabel,
	Input,
	Text,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import BrandButton from "../components/BrandButton.jsx";
import Header from "../components/Header.jsx";
import { validateToken } from "../utils/auth";

function UserPage() {
	const [firstName, setFirstName] = useState("");
	const [userId, setUserId] = useState("");

	const [firstNameInput, setFirstNameInput] = useState("");
	const [lastNameInput, setLastNameInput] = useState("");
	const [emailInput, setEmailInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");
	const [confirmInput, setConfirmInput] = useState("");
	const [currentPasswordInput, setCurrentPasswordInput] = useState("");

	const [expandFirstNameInput, setExpandFirstNameInput] = useState(false);
	const [expandLastNameInput, setExpandLastNameInput] = useState(false);
	const [expandEmailInput, setExpandEmailInput] = useState(false);
	const [expandPasswordInputs, setExpandPasswordInputs] = useState(false);

	const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
	const [invalidEmail, setInvalidEmail] = useState(false);
	const [confirmError, setConfirmError] = useState(false);
	const [currentPasswordError, setCurrentPasswordError] = useState(false);
	const [matchError, setMatchError] = useState(false);

	let invalidEmailMessage = invalidEmail ? "Entered value is not a valid email" : "";
	let confirmMessage = confirmError ? "Confirmation is required" : "";
	let currentPasswordMessage = currentPasswordError ? "Current password is required" : "";
	let matchMessage = matchError ? "Passwords do not match" : "";

	useEffect(() => {
		const validateAndExtract = async () => {
			const data = await validateToken();
			if (data.valid) {
				setFirstName(data.firstName);
				setUserId(data.userId);
			}
		};
		validateAndExtract();
	}, []);

	const updateEmail = (event) => {
		setEmailInput(event.currentTarget.value);
	};

	const updatePassword = (event) => {
		setPasswordInput(event.currentTarget.value);
	};

	const updateConfirm = (event) => {
		setConfirmInput(event.currentTarget.value);
	};

	const updateCurrentPassword = (event) => {
		setCurrentPasswordInput(event.currentTarget.value);
	};

	const updateFirstName = (event) => {
		setFirstNameInput(event.currentTarget.value);
	};

	const updateLastName = (event) => {
		setLastNameInput(event.currentTarget.value);
	};

	const update = async () => {
		const invalidEmailCheck = !emailPattern.test(emailInput);
		const confirmInputErrorCheck = confirmInput.trim() === "";
		const currentPasswordInputErrorCheck = currentPasswordInput.trim() === "";
		const passwordMatchErrorCheck =
			passwordInput.trim() !== confirmInput.trim() && confirmInput.trim() !== "";
		setConfirmError(confirmInputErrorCheck);
		setMatchError(passwordMatchErrorCheck);
		setInvalidEmail(invalidEmailCheck);
		setCurrentPasswordError(currentPasswordInputErrorCheck);

		// implement call to update depending on which fields are filled in
		const updateData = {};
		if (firstNameInput !== "") {
			updateData.firstName = firstNameInput;
		}
		if (lastNameInput !== "") {
			updateData.lastName = lastNameInput;
		}
		if (emailInput !== "") {
			updateData.email = emailInput;
		}
		if (passwordInput !== "" && confirmInput !== "" && currentPasswordInput !== "") {
			updateData.password = passwordInput;
			updateData.confirm = confirmInput;
			updateData.currentPassword = currentPasswordInput;
		}
	};

	return (
		<Box
			w="100vw"
			h="100vh"
			bgColor="gray.200"
			display="flex"
			flexDirection="column"
			alignItems="center"
		>
			<Header />
			<Heading>{firstName}'s Profile</Heading>
			<Text>Update your account details below</Text>
			<FormControl
				bgColor="white"
				w="50%"
				p={5}
				m={5}
				borderRadius={5}
				onKeyUp={(event) => {
					if (event.key === "Enter") update();
				}}
			>
				<Flex direction="column" gap={4}>
					<BrandButton
						width="fit-content"
						onClick={() => setExpandFirstNameInput(!expandFirstNameInput)}
					>
						Update First Name
					</BrandButton>
					{expandFirstNameInput && (
						<Input
							placeholder="First Name"
							onChange={updateFirstName}
							onBlur={updateFirstName}
							id="firstName"
						/>
					)}
					<BrandButton
						width="fit-content"
						onClick={() => setExpandLastNameInput(!expandLastNameInput)}
					>
						Update Last Name
					</BrandButton>
					{expandLastNameInput && (
						<Input
							placeholder="Last Name"
							onChange={updateLastName}
							onBlur={updateLastName}
							id="lastName"
						/>
					)}
					<BrandButton
						width="fit-content"
						onClick={() => setExpandEmailInput(!expandEmailInput)}
					>
						Update Email
					</BrandButton>
					{expandEmailInput && (
						<>
							<Input
								placeholder="New Email"
								onChange={updateEmail}
								onBlur={updateEmail}
								isInvalid={invalidEmail}
								id="email"
							/>
							<Text pb={3} my={0} py={0} color="red.600">
								{invalidEmailMessage}
							</Text>
						</>
					)}
					<BrandButton
						width="fit-content"
						onClick={() => setExpandPasswordInputs(!expandPasswordInputs)}
					>
						Update Password
					</BrandButton>
					{expandPasswordInputs && (
						<>
							<FormLabel fontSize="sm" ml={4} my={0}>
								New Password
							</FormLabel>
							<Input
								type="password"
								placeholder="New Password"
								onChange={updatePassword}
								onBlur={updatePassword}
								id="password"
							/>
							<FormLabel fontSize="sm" ml={4} my={0}>
								Confirm New Password
							</FormLabel>
							<Input
								type="password"
								placeholder="Confirm New Password"
								onChange={updateConfirm}
								onBlur={updateConfirm}
								id="confirm"
							/>
							<Text pb={3} my={0} py={0} color="red.600">
								{confirmMessage} {matchMessage}
							</Text>
							<FormLabel fontSize="sm" ml={4} my={0}>
								Current Password
							</FormLabel>
							<Input
								type="password"
								placeholder="Current Password"
								onChange={updateCurrentPassword}
								onBlur={updateCurrentPassword}
								id="currentPassword"
							/>
							<Text pb={3} my={0} py={0} color="red.600">
								{currentPasswordMessage}
							</Text>
						</>
					)}
				</Flex>
			</FormControl>
		</Box>
	);
}

export default UserPage;
