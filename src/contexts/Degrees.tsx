import { createContext, useContext } from "react"

import type { ReactNode } from "react"
import type { Degree } from "../types"

/** The type of the degrees context */
type DegreesContextType = Degree[]
/** The default value for the degrees context */
const defaultValue: DegreesContextType = []

/** The degrees context */
const DegreesContext = createContext<DegreesContextType>(defaultValue)

type ProviderProps = {
	children?: ReactNode | undefined
	year: string
}

let degreeNamesPromise: Promise<any> | undefined = undefined
let degreeNames: string[] | undefined = undefined

let degreesPromises: Promise<any> | undefined = undefined
let degrees: DegreesContextType = []

function degreeAbbreviationToFilename(degreeAbbreviation: string): string {
	return degreeAbbreviation
		.replaceAll(".", "")
		.replaceAll("(", "")
		.replaceAll(")", "")
		.replaceAll("& ", "")
		.replaceAll(" ", "-")
		.toLowerCase()
}

function orderDegrees(degrees: Degree[], degreeNames: string[]): Degree[] {
	// Associate each degree with its filename
	const degreesWithFilename: [filename: string, Degree][] = []
	for (const degree of degrees) {
		degreesWithFilename.push([degreeAbbreviationToFilename(degree.abbreviation), degree])
	}

	// Order the degrees
	const orderedDegrees = degreesWithFilename.reduce<Degree[]>((arr, [filename, degree], idx) => {
		arr[degreeNames.indexOf(filename)] = degree

		return arr
	}, [])

	return orderedDegrees
}

export function DegreesProvider({ children, year }: ProviderProps) {
	//// Get the degree names
	// Initial fetch
	if (typeof degreeNamesPromise === "undefined") {
		degreeNamesPromise = fetch(import.meta.env.BASE_URL + `/${year}/degrees.json`)
			.then(res => res.json())
			.then(data => degreeNames = data)

		throw degreeNamesPromise
	}

	// No response yet
	if (typeof degreeNames === "undefined") throw degreeNamesPromise

	//// Get each degree
	// Initial fetch
	const promises: Promise<any>[] = []
	if (typeof degreesPromises === "undefined") {
		for (const degreeName of degreeNames!) {
			promises.push(fetch(import.meta.env.BASE_URL + `/${year}/degrees/${degreeName}.json`)
				.then(res => res.json())
				.then(data => degrees.push(data)))
		}

		degreesPromises = Promise.all(promises)

		throw degreesPromises
	}

	// Not all responses are resolved
	if (degrees.length !== degreeNames!.length) throw degreesPromises

	// Order degrees based on the degree names
	return (
		<DegreesContext.Provider value={orderDegrees(degrees, degreeNames)}>
			{children}
		</DegreesContext.Provider>
	)
}

type ConsumerProps = {
	children: (value: DegreesContextType) => ReactNode
}

/** Consumer for the degrees context */
export function DegreesConsumer({ children }: ConsumerProps) {
	return (
		<DegreesContext.Consumer>
			{children}
		</DegreesContext.Consumer>
	)
}

/** Get the degrees */
export function useDegrees() {
	return useContext(DegreesContext)
}