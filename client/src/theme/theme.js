import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
	fonts: {
		heading: "Bitter, Sans-Serif",
		body: "Lato, Sans-Serif",
	},
	// make links not have text decoration and a different hover color
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
