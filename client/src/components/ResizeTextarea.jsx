import { forwardRef } from "react";
import { Textarea } from "@chakra-ui/react";
import ResizeTextarea from "react-textarea-autosize";

// Component designed and built to resize textarea based on the amount of text input
const AutoResizeTextarea = forwardRef(
	({ textareaInputValue, setTextareaInputValue, ...props }, ref) => {
		// ...props allows us to pass in any props we want to the component
		// ref allows us to pass in a ref to the component
		return (
			<Textarea
				ref={ref}
				as={ResizeTextarea}
				value={textareaInputValue}
				onChange={(event) => {
					setTextareaInputValue(event.target.value);
				}}
				{...props}
			/>
		);
	}
);

export default AutoResizeTextarea;
