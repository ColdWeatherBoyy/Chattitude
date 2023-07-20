import { Box, Heading, FormControl, FormLabel, Input, Button, Text } from "@chakra-ui/react";
import { useState } from "react";
import Header from "../components/Header.jsx";

function Login() {

	const [emailInput, setEmailInput] = useState(" ");
    const [passwordInput, setPasswordInput] = useState(" ");
	let emailError = emailInput === '';
	let passwordError = passwordInput === '';
	let emailMessage = (emailError ? "Email is required" : "");
	let passwordMessage = (passwordError ? "Password is required" : "");

	const signIn = () => {
		if (emailInput === ' ') {
			emailError = true;
		}
		if (passwordInput === ' ') {
			passwordError = true;
		}
		console.log("sign in attempt");
		console.log("Email: " + emailInput);
		console.log("Password: " + passwordInput);
	}

	const updateEmail = (event) => {
		setEmailInput(event.currentTarget.value);
	}

	const updatePassword = (event) => {
		setPasswordInput(event.currentTarget.value);
	}

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
				<Heading
					my={5}
				>
					Login
				</Heading>
				<FormControl
					bgColor="white"
					w="50%"
					p={5}
					m={5}
					borderRadius={5}
				>
                    <FormLabel>Email</FormLabel>
                    <Input placeholder='Email' onChange={updateEmail} onBlur={updateEmail} isInvalid={emailError}/>
					<Text pb={3} color="red.600">{emailMessage}</Text>
                    <FormLabel>Password</FormLabel>
                    <Input type="password" placeholder='Password' onChange={updatePassword} onBlur={updatePassword} isInvalid={passwordError}/>
					<Text pb={3} color="red.600">{passwordMessage}</Text>
                </FormControl>
                <Button
                    onClick={signIn}
					bgColor="brand.300"
					color="brand.200"
					_hover={{
						bgColor: "brand.200",
						color: "brand.300",
						borderColor: "brand.200"
					}}
                >
                    Log In
                </Button>
			</Box>
		</>
	);
}

export default Login;
