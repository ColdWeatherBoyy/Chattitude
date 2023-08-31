import { Button } from "@chakra-ui/react";

// Creates a custom button with the brand colors and design	to use throughout app
const BrandButton = ({ children, ...rest }) => {
	// Children is used to represent the text inside the button tags
	// Rest is used to represent any other props passed to the button (in this case, generally onClick functions)
	return (
		// Default styling for brand button
		<Button
			bgColor="brand.300"
			color="brand.200"
			_hover={{
				bgColor: "brand.200",
				color: "brand.300",
				borderColor: "brand.200",
			}}
			borderColor="transparent"
			boxShadow="sm"
			_active={{
				boxShadow:
					"inset 0 1px 3px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(0, 0, 0, 0.06)",
				bgColor: "gray.300",
				borderColor: "transparent",
			}}
			_focus={{
				outline: "none",
			}}
			// THe rest of the props are spread onto the button
			{...rest}
		>
			{/* The text for the button */}
			{children}
		</Button>
	);
};

export default BrandButton;
