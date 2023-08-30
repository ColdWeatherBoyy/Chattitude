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
import { set } from "mongoose";

function UserPage() {
	// ******************************************************
	// ****************  User States *******************
	// ******************************************************
	// User values
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [userId, setUserId] = useState("");
	const [email, setEmail] = useState("");
	// Input values
	const [firstNameInput, setFirstNameInput] = useState("");
	const [lastNameInput, setLastNameInput] = useState("");
	const [emailInput, setEmailInput] = useState("");
	const [passwordInput, setPasswordInput] = useState("");
	const [confirmInput, setConfirmInput] = useState("");
	const [currentPasswordInput, setCurrentPasswordInput] = useState("");
	// Expand section values
	const [expandFirstNameInput, setExpandFirstNameInput] = useState(false);
	const [expandLastNameInput, setExpandLastNameInput] = useState(false);
	const [expandEmailInput, setExpandEmailInput] = useState(false);
	const [expandPasswordInputs, setExpandPasswordInputs] = useState(false);

	// States for errors
	const [invalidEmail, setInvalidEmail] = useState(false);
	const [confirmError, setConfirmError] = useState(false);
	const [currentPasswordError, setCurrentPasswordError] = useState(false);
	const [matchError, setMatchError] = useState(false);

	// ******************************************************
	// *************  Conditional Error Values **************
	// ******************************************************
	let invalidEmailMessage = invalidEmail ? "Entered value is not a valid email" : "";
	let confirmMessage = confirmError ? "Confirmation is required" : "";
	let currentPasswordMessage = currentPasswordError ? "Current password is required" : "";
	let matchMessage = matchError ? "Passwords do not match" : "";

	// Email Regex Pattern
	const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	// ******************************************************
	// ****************  User Functions *********************
	// ******************************************************

	// Function to validate token and extract user data
	const validateAndExtract = async () => {
		const data = await validateToken();
		if (data.valid) {
			setFirstName(data.firstName);
			setUserId(data.userId);
		}
	};

	// Fetch function to get rest of user data
	const fetchUser = async () => {
		const response = await fetch(`/api/user/get/${userId}`);
		const data = await response.json();
		setFirstName(data.first_name);
		setLastName(data.last_name);
		setEmail(data.email);
	};

	// Update function to update user data. Updates body depending on which fields are filled
	const update = async () => {
		// Error checks
		const invalidEmailCheck = emailInput ? !emailPattern.test(emailInput) : false;
		const confirmInputErrorCheck = passwordInput ? confirmInput.trim() === "" : false;
		const currentPasswordInputErrorCheck = passwordInput
			? currentPasswordInput.trim() === ""
			: false;
		const passwordMatchErrorCheck =
			passwordInput.trim() !== confirmInput.trim() && confirmInput.trim() !== "";

		// Set error states
		setConfirmError(confirmInputErrorCheck);
		setMatchError(passwordMatchErrorCheck);
		setInvalidEmail(invalidEmailCheck);
		setCurrentPasswordError(currentPasswordInputErrorCheck);

		// Data to be sent in fetch request
		const updateData = {};

		// Check which fields are filled and add to updateData
		if (firstNameInput !== "") {
			updateData.newFirstName = firstNameInput;
		}
		if (lastNameInput !== "") {
			updateData.newLastName = lastNameInput;
		}
		if (emailInput !== "") {
			updateData.newEmail = emailInput;
		}
		if (passwordInput !== "" && confirmInput !== "" && currentPasswordInput !== "") {
			updateData.newPassword = passwordInput;
			updateData.confirmationNewPassword = confirmInput;
			updateData.existingPassword = currentPasswordInput;
		}

		// If no fields are filled, alert user
		if (
			!updateData.newFirstName &&
			!updateData.newLastName &&
			!updateData.newEmail &&
			!updateData.newPassword &&
			!updateData.confirmationNewPassword &&
			!updateData.existingPassword
		) {
			alert("No changes made");
		} else {
			// fetch request for updating user data if any fields are filled
			const response = await fetch(`/api/user/put/${userId}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(updateData),
			});
			if (response.ok) {
				// reloads page to update user data
				window.location.href = `/${userId}`;
			}
		}
	};

	// Input update functions
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

	// ******************************************************
	// ****************  User useEffects ********************
	// ******************************************************

	// Validate token and extract user data on mount
	useEffect(() => {
		validateAndExtract();
	}, []);

	// Fetch user data on userId change (validation)
	useEffect(() => {
		if (userId) {
			fetchUser();
		}
	}, [userId]);

	return (
		<Box
			w="100vw"
			h="100%"
			minH="100vh"
			bgColor="gray.200"
			display="flex"
			flexDirection="column"
			alignItems="center"
		>
			<Header />
			<Box
				width="60%"
				display="flex"
				flexDirection="column"
				alignItems="center"
				my={20}
				gap={6}
			>
				<Heading>{firstName}'s Profile</Heading>
				<Text>Update your account details below</Text>
				<FormControl
					bgColor="white"
					w="100%"
					p={5}
					m={5}
					borderRadius={5}
					onKeyUp={(event) => {
						if (event.key === "Enter") update();
					}}
				>
					<Flex direction="column" gap={2}>
						{/* Click all brand buttons to expand their respective inputs */}
						<BrandButton
							width="fit-content"
							onClick={() => setExpandFirstNameInput(!expandFirstNameInput)}
						>
							Update First Name
						</BrandButton>
						{expandFirstNameInput && (
							<Input
								placeholder={firstName}
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
								placeholder={lastName}
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
									placeholder={email}
									onChange={updateEmail}
									onBlur={updateEmail}
									isInvalid={invalidEmail}
									id="email"
								/>
								{/* Error messages for invalid email */}
								<Text my={0} py={0} color="red.600">
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
								<FormLabel fontSize="sm" ml={4} my={0} py={0}>
									New Password
								</FormLabel>
								<Input
									type="password"
									placeholder="New Password"
									onChange={updatePassword}
									onBlur={updatePassword}
									id="password"
								/>
								<FormLabel fontSize="sm" ml={4} my={0} py={0}>
									Confirm New Password
								</FormLabel>
								<Input
									type="password"
									placeholder="Confirm New Password"
									onChange={updateConfirm}
									onBlur={updateConfirm}
									id="confirm"
								/>
								{/* Error messages for confirmation password */}
								{confirmMessage || matchMessage ? (
									<Text my={0} py={0} color="red.600">
										{confirmMessage} {matchMessage}
									</Text>
								) : (
									<> </>
								)}
								<FormLabel fontSize="sm" ml={4} my={0} py={0}>
									Current Password
								</FormLabel>
								<Input
									type="password"
									placeholder="Current Password"
									onChange={updateCurrentPassword}
									onBlur={updateCurrentPassword}
									id="currentPassword"
								/>
								{/* Error messages for current password */}
								<Text my={0} py={0} color="red.600">
									{currentPasswordMessage}
								</Text>
							</>
						)}
					</Flex>
				</FormControl>
				<BrandButton mb={3} onClick={update}>
					Update
				</BrandButton>
			</Box>
		</Box>
	);
}

export default UserPage;
