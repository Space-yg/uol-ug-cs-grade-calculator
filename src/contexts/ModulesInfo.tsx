import { createContext, useContext } from "react"

import type { ReactNode } from "react"
import type { Module } from "../types"

/** The type of the modules info context */
type ModulesInfoContextType = Module[]
/** The default value for the modules info context */
const defaultValue: ModulesInfoContextType = []

/** The modules info context */
const ModulesInfoContext = createContext<ModulesInfoContextType>(defaultValue)

type ProviderProps = {
	children?: ReactNode | undefined
	year: string
}

let modulesInfoPromise: Promise<any> | undefined = undefined
let modulesInfo: ModulesInfoContextType | undefined = undefined

export function ModulesInfoProvider({ children, year }: ProviderProps) {
	// Initial fetch
	if (typeof modulesInfoPromise === "undefined") {
		modulesInfoPromise = fetch(import.meta.env.BASE_URL + `/${year}/modules.json`)
			.then(res => res.json())
			.then(data => modulesInfo = data)

		throw modulesInfoPromise
	}

	// No response yet
	if (typeof modulesInfo === "undefined") throw modulesInfoPromise

	return (
		<ModulesInfoContext.Provider value={modulesInfo!}>
			{children}
		</ModulesInfoContext.Provider>
	)
}

type ConsumerProps = {
	children: (value: ModulesInfoContextType) => ReactNode
}

/** Consumer for the modules info context */
export function ModulesInfoConsumer({ children }: ConsumerProps) {
	return (
		<ModulesInfoContext.Consumer>
			{children}
		</ModulesInfoContext.Consumer>
	)
}

/** Get the modules info */
export function useModulesInfo() {
	return useContext(ModulesInfoContext)
}