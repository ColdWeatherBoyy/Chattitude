import {
	Box,
	Heading,
	FormControl,
	FormLabel,
	Input,
	Button,
	Text,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

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
				<Heading>Chattitude</Heading>
				<Box display="flex" flexDirection="row">
					<Link to="/login">
						<Text mx={3}>Login</Text>
					</Link>
					<Link to="/signup">
						<Text mx={3}>Sign Up</Text>
					</Link>
				</Box>
			</Box>
		</>
	);
}

export default Header;
