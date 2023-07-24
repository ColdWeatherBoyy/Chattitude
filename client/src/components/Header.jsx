import { Link as ReactRouterLink } from "react-router-dom";
import { Box, Heading, Text, Link } from "@chakra-ui/react";

function Header() {
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
					<Link as={ReactRouterLink} to="/login">
						<Text mx={3}>Login</Text>
					</Link>
					<Link as={ReactRouterLink} to="/signup">
						<Text mx={3}>Sign Up</Text>
					</Link>
				</Box>
			</Box>
		</>
	);
}

export default Header;
