import { createContext, useContext, useEffect, useReducer } from "react"

import type { ReactNode } from "react"
import type { ModuleStatus } from "@/types"

/** The type of the module status context */
type ModuleStatusContextType = ModuleStatus
/** The default value for the module status context */
const defaultValue: ModuleStatusContextType = "not-attempted"

/** All actions that can be done on module status */
type Actions = {
	type: "set"
	moduleStatus: ModuleStatusContextType
}

/** The module status context */
const ModuleStatusContext = createContext<ModuleStatusContextType>(defaultValue)
/** The module status dispatch context */
const ModuleStatusDispatchContext = createContext<React.ActionDispatch<[Actions]> | null>(null)

/**
 * Execute an action on the module status
 * @param moduleStatus The current module status
 * @param action The action to make on the module status
 * @returns The new module status
 */
function ModuleStatusReducer(moduleStatus: ModuleStatusContextType, action: Actions): ModuleStatusContextType {
	switch (action.type) {
		case "set":
			return action.moduleStatus
	}
}

type Props = {
	children?: ReactNode | undefined
	global?: boolean
}

/** Provider for the module status context */
export function ModuleStatusProvider({ children, global }: Props) {
	const [moduleStatus, dispatch] = useReducer<ModuleStatusContextType, [Actions]>(ModuleStatusReducer, defaultValue)

	// Local
	if (!global) {
		const globalModuleStatus = useModuleStatus()

		// When the global status changes, change the local status
		useEffect(() => {
			if (globalModuleStatus !== "custom")
				dispatch({
					type: "set",
					moduleStatus: globalModuleStatus,
				})
		}, [dispatch, globalModuleStatus])
	}

	return (
		<ModuleStatusDispatchContext.Provider value={dispatch}>
			<ModuleStatusContext.Provider value={moduleStatus}>
				{children}
			</ModuleStatusContext.Provider>
		</ModuleStatusDispatchContext.Provider>
	)
}

type ConsumerProps = {
	children: (value: ModuleStatusContextType, dispatch: React.ActionDispatch<[Actions]>) => ReactNode
}

/** Consumer for the module status context */
export function ModuleStatusConsumer({ children }: ConsumerProps) {
	return (
		<ModuleStatusDispatchContext.Consumer>
			{dispatch =>
				<ModuleStatusContext.Consumer>
					{moduleStatus =>
						children(moduleStatus, dispatch!)
					}
				</ModuleStatusContext.Consumer>
			}
		</ModuleStatusDispatchContext.Consumer>
	)
}

/** Get the module status */
export function useModuleStatus() {
	return useContext(ModuleStatusContext)
}

/** Execute an event on the module status */
export function useModuleStatusDispatch() {
	return useContext(ModuleStatusDispatchContext)!
}