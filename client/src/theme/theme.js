import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
	// Makes some fonts available
	fonts: {
		heading: "Bitter, Sans-Serif",
		body: "Lato, Sans-Serif",
	},
	// Make links not have text decoration and adds a different hover color
	components: {
		Link: {
			baseStyle: {
				_hover: {
					textDecoration: "none",
					color: "brand.400",
				},
			},
		},
	},
	// Adds some custom colors
	colors: {
		brand: {
			100: "#000000",
			200: "#FFFFFF",
			300: "#0D968B",
			400: "#2F4858",
		},
	},
});

export default theme;
