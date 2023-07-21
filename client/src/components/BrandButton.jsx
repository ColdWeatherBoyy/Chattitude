import { Button } from "@chakra-ui/react";

const BrandButton = ({ children, ...rest }) => {
	return (
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
			{...rest}
		>
			{children}
		</Button>
	);
};

export default BrandButton;
