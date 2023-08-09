import { CircularProgress, Flex } from "@chakra-ui/react";

// Component designed and built for loading API call, utilizing Chakra's circular progress bar for a more visually engaging loader effect
function Loader({ marginBottom }) {
	return (
		<Flex justify="center" align="center" width="100%" mb={marginBottom}>
			<CircularProgress
				capIsRound
				isIndeterminate
				value={75}
				color="gray.400"
				thickness="5px"
				trackColor="gray.100"
				position="absolute"
				transform="scale(1)"
			/>
			<CircularProgress
				capIsRound
				isIndeterminate
				value={75}
				color="brand.300"
				thickness="6.75px"
				trackColor="gray.100"
				position="absolute"
				transform="scale(.75) scaleX(-1) rotate(-60deg)"
			/>
			<CircularProgress
				capIsRound
				isIndeterminate
				value={75}
				thickness="9.5px"
				color="gray.400"
				trackColor="gray.100"
				position="absolute"
				transform="scale(.5)"
			/>
			<CircularProgress
				capIsRound
				isIndeterminate
				value={75}
				thickness="17px"
				color="brand.300"
				trackColor="gray.100"
				position="absolute"
				transform="scale(.25) scaleX(-1) rotate(-60deg)"
			/>
		</Flex>
	);
}

export default Loader;
