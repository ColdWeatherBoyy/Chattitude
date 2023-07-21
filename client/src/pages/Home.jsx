import React from "react";
import { Box, Heading, Text, Button } from "@chakra-ui/react";
import Header from "../components/Header.jsx";
import BrandButton from "../components/BrandButton.jsx";
import { Link } from "react-router-dom";

const Home = () => {
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
				<Box display="flex" flexDirection="column" alignItems="center" my={20} gap={6}>
					<Heading my={5}>Welcome to Chattitude!</Heading>
					<Text fontSize="xl" maxW="50%" textAlign="center" p={5}>
						<span style={{ color: "#0D968B", fontWeight: "bold" }}>Chattitude</span> is a
						chat app designed to host unfiltered conversations between any and all people
						who want to talk about, well, whatever! Sign up or log in, and let's get
						chatting!
					</Text>
					<Box display="flex" flexDirection="row" gap={8}>
						<Link to="/login">
							<BrandButton width="100%">Log In</BrandButton>
						</Link>
						<Link to="/signup">
							<BrandButton width="100%">Sign Up</BrandButton>
						</Link>
					</Box>
				</Box>
			</Box>
		</>
	);
};

export default Home;
