import {
	Box,
	Flex,
	Heading,
	FormControl,
	FormLabel,
	Input,
	Text,
	Tabs,
	TabList,
	TabPanels,
	Tab,
	TabPanel,
	useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import BrandButton from "../components/BrandButton.jsx";
import Header from "../components/Header.jsx";
import { validateToken, logout } from "../utils/auth";

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
	const [deleteEmail, setDeleteEmail] = useState("");
	const [deletePassword, setDeletePassword] = useState("");

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

	// States for deleting account
	const [deleteEmailError, setDeleteEmailError] = useState(false);
	const [deletePasswordError, setDeletePasswordError] = useState(false);

	// Tab states
	const [leftActiveState, setLeftActiveState] = useState(true);

	// ******************************************************
	// ******************** Toast Hooks *********************
	// ******************************************************
	const toast = useToast();

	// ******************************************************
	// *************  Conditional Error Values **************
	// ******************************************************
	let invalidEmailMessage = invalidEmail ? "Entered value is not a valid email" : "";
	let confirmMessage = confirmError ? "Confirmation is required" : "";
	let currentPasswordMessage = currentPasswordError ? "Current password is required" : "";
	let matchMessage = matchError ? "Passwords do not match" : "";
	let deleteEmailMessage = deleteEmailError ? "Email is required to delete account" : "";
	let deletePasswordMessage = deletePasswordError
		? "Password is required to delete account"
		: "";

	// Email Regex Pattern
	const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	// ******************************************************
	// ****************  User Functions *********************
	// ******************************************************

	// Function to validate token and extract user data
	const validateAndExtract = async () => {
		const data = await validateToken();
		if (data.valid) {
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
	const updateAccount = async () => {
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

		// If no fields are filled, toast user
		if (
			!updateData.newFirstName &&
			!updateData.newLastName &&
			!updateData.newEmail &&
			!updateData.newPassword &&
			!updateData.confirmationNewPassword &&
			!updateData.existingPassword
		) {
			toast({
				title: "No changes provided.",
				description: "Please fill out at least one field to update.",
				status: "warning",
				duration: 3000,
				isClosable: true,
			});
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
				toast({
					title: "Success",
					description: "Account updated.",
					status: "success",
					duration: 3000,
					isClosable: true,
				});

				setTimeout(() => {
					window.location.reload();
				}, 750);
			} else {
				const error = await response.json();
				toast({
					title: "Update failed",
					description: error.error,
					status: "error",
					duration: 3000,
					isClosable: true,
				});
			}
		}
	};

	const deleteAccount = async () => {
		// Error checks
		const deleteEmailErrorCheck = deleteEmail.trim() === "";
		const deletePasswordErrorCheck = deletePassword.trim() === "";

		// Set error states
		setDeleteEmailError(deleteEmailErrorCheck);
		setDeletePasswordError(deletePasswordErrorCheck);

		// Data to be sent in fetch request
		const deleteData = { email: deleteEmail, password: deletePassword };

		if (deleteEmailErrorCheck || deletePasswordErrorCheck) {
			toast({
				title: "Please fill out all fields to delete account.",
				status: "error",
				duration: 3000,
				isClosable: true,
			});
		} else {
			// fetch request for deleting user data and logout current user, redirecting them to homepage
			const response = await fetch(`/api/user/delete/${userId}`, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(deleteData),
			});
			if (response.ok) {
				toast({
					title: "Account deleted",
					description: "You will be redirected to the homepage.",
					status: "success",
					duration: 3000,
					isClosable: true,
				});
				await logout(userId);
				if (response.ok && response.status === 200) {
					setTimeout(() => {
						window.location.href = "/";
					}, 750);
				}
			} else {
				toast({
					title: "Incorrect email or password",
					description: "Please try again.",
					status: "error",
					duration: 3000,
					isClosable: true,
				});
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

	const updateDeleteEmail = (event) => {
		setDeleteEmail(event.currentTarget.value);
	};
	const updateDeletePassword = (event) => {
		setDeletePassword(event.currentTarget.value);
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

				<Tabs variant="enclosed-colored" width="100%" isFitted size="lg">
					<TabList>
						<Tab
							border="none"
							borderBottomRadius={0}
							borderTopRightRadius={0}
							_selected={{
								color: "brand.300",
								bgColor: "white",
								outline: "none",
							}}
							onClick={() => setLeftActiveState(true)}
						>
							Update Account
						</Tab>
						<Tab
							border="none"
							borderBottomRadius={0}
							borderTopLeftRadius={0}
							_selected={{
								color: "brand.300",
								bgColor: "white",
								outline: "none",
							}}
							onClick={() => setLeftActiveState(false)}
						>
							Delete Account
						</Tab>
					</TabList>
					<TabPanels>
						<TabPanel padding={0}>
							<FormControl
								bgColor="white"
								w="100%"
								p={5}
								borderBottomRadius={5}
								onKeyUp={(event) => {
									if (event.key === "Enter") updateAccount();
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
											width="50%"
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
											width="50%"
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
												width="50%"
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
												width="50%"
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
												width="50%"
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
												width="50%"
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
						</TabPanel>
						<TabPanel padding={0}>
							<FormControl
								bgColor="white"
								w="100%"
								p={5}
								borderBottomRadius={5}
								onKeyUp={(event) => {
									if (event.key === "Enter") deleteAccount();
								}}
							>
								<Flex direction="column" gap={2}>
									<FormLabel ml={4} my={0} py={0}>
										Please enter your email to confirm account deletion.
									</FormLabel>
									<Input
										placeholder="Email"
										width="50%"
										onChange={updateDeleteEmail}
										onBlur={updateDeleteEmail}
										isInvalid={deleteEmailError}
										id="deleteEmail"
									/>
									<Text my={0} py={0} color="red.600">
										{deleteEmailMessage}
									</Text>
									<FormLabel ml={4} my={0} py={0}>
										Please enter your password to confirm account deletion.
									</FormLabel>
									<Input
										type="password"
										placeholder="Password"
										width="50%"
										onChange={updateDeletePassword}
										onBlur={updateDeletePassword}
										isInvalid={deletePasswordError}
										id="deletePassword"
									/>
									<Text my={0} py={0} color="red.600">
										{deletePasswordMessage}
									</Text>
								</Flex>
							</FormControl>
						</TabPanel>
					</TabPanels>
				</Tabs>
				{leftActiveState ? (
					<BrandButton mb={3} onClick={updateAccount}>
						Update
					</BrandButton>
				) : (
					<BrandButton mb={3} onClick={deleteAccount}>
						Delete
					</BrandButton>
				)}
			</Box>
		</Box>
	);
}

export default UserPage;
