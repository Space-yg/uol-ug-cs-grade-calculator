import { useCallback, useRef } from "react"

import type { JSX } from "react"

type Props = JSX.IntrinsicElements["input"] & {
	handleGradeOnInput?: (grade: number) => void
}

export default function GradeInput({ handleGradeOnInput, ...inputProps }: Props) {
	const inputElement = inputProps.ref as React.RefObject<HTMLInputElement | null> ?? useRef<HTMLInputElement>(null)

	const handleInputOnKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
		// No e, -, ., or +
		if (["e", "-", ".", "+"].includes(event.key)) event.preventDefault()
	}, [])

	const handleInputOnInput = useCallback((event: React.InputEvent<HTMLInputElement>) => {
		// Only 3 characters
		inputElement.current!.value = inputElement.current!.value.slice(0, 3)

		// Limit number from 0 to 100
		if (inputElement.current!.valueAsNumber < 0) inputElement.current!.valueAsNumber = 0
		if (inputElement.current!.valueAsNumber > 100) inputElement.current!.valueAsNumber = 100

		// Execute any other events
		handleGradeOnInput?.(isNaN(event.currentTarget.valueAsNumber) ? 0 : event.currentTarget.valueAsNumber)
	}, [handleGradeOnInput])

	return (
		<input {...inputProps} ref={inputElement} type="number" inputMode="numeric" min="0" max="100" onKeyDown={handleInputOnKeyDown} onInput={handleInputOnInput} />
	)
}