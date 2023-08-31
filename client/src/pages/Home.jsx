import { useState, useEffect } from "react";
import { Box, Heading, Text } from "@chakra-ui/react";
import Header from "../components/Header.jsx";
import BrandButton from "../components/BrandButton.jsx";
import { Link } from "react-router-dom";
import { validateTokenForDisplay } from "../utils/auth.js";

const Home = () => {
	// ******************************************************
	// ****************  Home States *************************
	// ******************************************************
	const [validated, setValidated] = useState(false);

	// ******************************************************
	// ****************  Home Functions **********************
	// ******************************************************
	// Function to validate token
	const validateAndExtract = async () => {
		const data = await validateTokenForDisplay();
		if (data.valid) {
			setValidated(true);
		} else {
			setValidated(false);
		}
	};

	// ******************************************************
	// ****************  Home UseEffects *********************
	// ******************************************************
	// useEffect to validate token on mount
	useEffect(() => {
		validateAndExtract();
	}, []);

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
			<Box display="flex" flexDirection="column" alignItems="center" my={20} gap={6}>
				<Heading my={5}>Welcome to Chattitude!</Heading>
				<Text fontSize="xl" maxW="50%" textAlign="center" p={5}>
					<span style={{ color: "#0D968B", fontWeight: "bold" }}>Chattitude</span> is a
					chat app designed to host unfiltered conversations between any and all people
					who want to talk about, well, whatever!{" "}
					{/* If validated, different text and buttons render. */}
					{!validated ? (
						<span>Sign up or log in, and let's get chatting!</span>
					) : (
						<span> You're logged in, now get chatting!</span>
					)}
				</Text>
				<Box display="flex" flexDirection="row" gap={8}>
					{!validated ? (
						<>
							<Link to="/login">
								<BrandButton width="100%">Log In</BrandButton>
							</Link>
							<Link to="/signup">
								<BrandButton width="100%">Sign Up</BrandButton>
							</Link>
						</>
					) : (
						<Link to="/globalchat">
							<BrandButton width="100%">Get Chatting!</BrandButton>
						</Link>
					)}
				</Box>
			</Box>
		</Box>
	);
};

export default Home;
