import { Link as ReactRouterLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Heading, Text, Link, useToast } from "@chakra-ui/react";
import { validateTokenForDisplay, logout } from "../utils/auth.js";

// Header component for the app
function Header() {
	// ******************************************************
	// ****************  Header States **********************
	// ******************************************************

	// States needed for validation, loading, and user values
	const [loading, setLoading] = useState(true);
	const [validated, setValidated] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [userId, setUserId] = useState("");

	// ******************************************************
	// ****************  Toast Hook *************************
	// ******************************************************
	const toast = useToast();

	// ******************************************************
	// ****************  Header Functions *******************
	// ******************************************************

	// Log out user
	const handleLogout = async () => {
		// This function will log the user out by removing the token from the http-only cookies
		const response = await logout(userId);
		// If the response is ok, then the user is logged out and the values for the user states are reset
		if (response.ok && response.status === 200) {
			setValidated(false);
			setFirstName("");
			setUserId("");
		}
		// Redirect to home page
		toast({
			title: "Logged out",
			description: "You will be redirected to the homepage.",
			status: "success",
			duration: 3000,
			isClosable: true,
		});
		setTimeout(() => {
			window.location.href = "/";
		}, 750);
	};

	// ******************************************************
	// ****************  Header UseEffects ******************
	// ******************************************************

	// Validate token and extract user values for page display
	useEffect(() => {
		const validateAndExtract = async () => {
			const data = await validateTokenForDisplay();
			if (data.valid) {
				setValidated(true);
				setFirstName(data.firstName);
				setUserId(data.userId);
			} else {
				setValidated(false);
				setFirstName("");
				setUserId("");
			}
		};
		validateAndExtract();
	}, []);

	// UseEffect to set loading to false when the user values are finished being set after validation
	useEffect(() => {
		if (validated) {
			setLoading(false);
		}
	}, [firstName]);

	return (
		<Box
			w="100%"
			h="50px"
			bgColor="brand.300"
			display="flex"
			flexDirection="row"
			justifyContent="space-between"
			alignItems="center"
			px={5}
			color="white"
		>
			<Link as={ReactRouterLink} to="/">
				<Heading>Chattitude</Heading>
			</Link>
			<Box display="flex" flexDirection="row">
				{/* Conditional display of options in the right hand side of the header (logout and link to user page vs. sign up and log in links) */}
				{!loading && validated ? (
					<>
						<Link as={ReactRouterLink} to={`/${userId}`}>
							<Text mx={3}>{firstName}</Text>
						</Link>
						<Link onClick={() => handleLogout()}>
							<Text mx={3}>Logout</Text>
						</Link>
					</>
				) : (
					<>
						<Link as={ReactRouterLink} to="/login">
							<Text mx={3}>Login</Text>
						</Link>
						<Link as={ReactRouterLink} to="/signup">
							<Text mx={3}>Sign Up</Text>
						</Link>
					</>
				)}
			</Box>
		</Box>
	);
}

export default Header;
