import React, { createContext, useContext } from "react"
import { useImmerReducer } from "use-immer"

import type { ReactNode } from "react"
import type { ModuleCode, ModuleStatus } from "@/types"

/** The type of the modules context */
type ModulesContextType = {
	[code: ModuleCode]: {
		grade: number
		status: ModuleStatus
	}
}
/** The default value for the modules context */
const defaultValue: ModulesContextType = {}

type OverrideAction = {
	type: "override"
	modules: ModulesContextType
}

type UpdateAction = {
	type: "update"
	table: HTMLTableElement
}

/** All actions that can be done on modules */
type Actions = OverrideAction | UpdateAction

/** The modules context */
const ModulesContext = createContext<ModulesContextType>(defaultValue)
/** The modules dispatch context */
const ModulesDispatchContext = createContext<React.ActionDispatch<[Actions]> | null>(null)

/**
 * Execute an action on the modules
 * @param draft The current modules
 * @param action The action to make on the modules
 * @returns The new modules
 */
function ModulesReducer(draft: ModulesContextType, action: Actions): ModulesContextType | void {
	switch (action.type) {
		case "override":
			return action.modules
		case "update":
			const modules: ModulesContextType = {}
			action.table.querySelectorAll<HTMLTableRowElement>("tbody > tr.module").forEach(tr => {
				const code = tr.querySelector<HTMLTableCellElement>(".code")!.innerText as ModuleCode
				let grade = tr.querySelector<HTMLInputElement>(".grade input")!.valueAsNumber
				grade = isNaN(grade) ? 0 : grade
				const status = tr.querySelector<HTMLSelectElement>(".status select")!.value as ModuleStatus

				modules[code] = {
					grade,
					status,
				}
			})
			return modules
	}
}

type Props = {
	children?: ReactNode | undefined
}

/** Provider for the modules context */
export function ModulesProvider({ children }: Props) {
	const [modules, dispatch] = useImmerReducer<ModulesContextType, Actions>(ModulesReducer, defaultValue)

	return (
		<ModulesDispatchContext.Provider value={dispatch}>
			<ModulesContext.Provider value={modules}>
				{children}
			</ModulesContext.Provider>
		</ModulesDispatchContext.Provider>
	)
}

type ConsumerProps = {
	children: (value: ModulesContextType, dispatch: React.ActionDispatch<[Actions]>) => ReactNode
}

/** Consumer for the modules context */
export function ModulesConsumer({ children }: ConsumerProps) {
	return (
		<ModulesDispatchContext.Consumer>
			{dispatch =>
				<ModulesContext.Consumer>
					{modules =>
						children(modules, dispatch!)
					}
				</ModulesContext.Consumer>
			}
		</ModulesDispatchContext.Consumer>
	)
}

/** Get the modules */
export function useModules() {
	return useContext(ModulesContext)
}

/** Execute an event on the modules */
export function useModulesDispatch() {
	return useContext(ModulesDispatchContext)!
}