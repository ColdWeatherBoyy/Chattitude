import { forwardRef, useState } from "react";
import { Textarea } from "@chakra-ui/react";
import ResizeTextarea from "react-textarea-autosize";

const AutoResizeTextarea = forwardRef(
	({ textareaInputValue, setTextareaInputValue, ...props }, ref) => {
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
