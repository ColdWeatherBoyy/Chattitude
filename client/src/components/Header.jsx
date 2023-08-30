import { Link as ReactRouterLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { Box, Heading, Text, Link } from "@chakra-ui/react";
import { validateTokenForDisplay, logout } from "../utils/auth.js";

function Header() {
	const [loading, setLoading] = useState(true);
	const [validated, setValidated] = useState(false);
	const [firstName, setFirstName] = useState("");
	const [userId, setUserId] = useState("");

	const handleLogout = async () => {
		const response = await logout(userId);
		if (response.ok && response.status === 200) {
			setValidated(false);
			setFirstName("");
			setUserId("");
		}
		window.location.href = "/";
	};

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

	useEffect(() => {
		if (validated) {
			setLoading(false);
		}
	}, [firstName]);

	return (
		<>
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
		</>
	);
}

export default Header;
