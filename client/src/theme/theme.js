import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
	fonts: {
		heading: "Sans-Serif",
	},
	colors: {
		brand: {
			100: "#000000",
			200: "#FFFFFF",
			300: "#0D968B",
		},
	},
});

export default theme;
