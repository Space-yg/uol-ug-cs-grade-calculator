import { createContext, useContext } from "react"

import type { ReactNode } from "react"

/** The type of the years context */
type YearsContextType = string[]
/** The default value for the years context */
const defaultValue: YearsContextType = []

/** The years context */
const YearsContext = createContext<YearsContextType>(defaultValue)

type ProviderProps = {
	children?: ReactNode | undefined
}

let yearsPromise: Promise<any> | undefined = undefined
let years: YearsContextType | undefined = undefined

export function YearsProvider({ children }: ProviderProps) {
	// Initial fetch
	if (typeof yearsPromise === "undefined") {
		yearsPromise = fetch(import.meta.env.BASE_URL + "/years.json")
			.then(res => res.json())
			.then(data => years = data)

		throw yearsPromise
	}

	// No response yet
	if (typeof years === "undefined") throw yearsPromise

	return (
		<YearsContext.Provider value={years!}>
			{children}
		</YearsContext.Provider>
	)
}

type ConsumerProps = {
	children: (value: YearsContextType) => ReactNode
}

/** Consumer for the years context */
export function YearsConsumer({ children }: ConsumerProps) {
	return (
		<YearsContext.Consumer>
			{children}
		</YearsContext.Consumer>
	)
}

/** Get the years */
export function useYears() {
	return useContext(YearsContext)
}