import { useCallback, useEffect, useState } from "react"
import { useModuleStatus, useModuleStatusDispatch } from "$/contexts/ModuleStatus"

import type { ModuleStatus } from "@/types"

type Props = {
	header?: boolean
	globalModuleStatusDispatch?: ReturnType<typeof useModuleStatusDispatch>
	updateModules: () => void
	onStatusChange?: (status: ModuleStatus) => void
}

export default function StatusSelect({ header, globalModuleStatusDispatch, updateModules, onStatusChange }: Props) {
	const moduleStatus = useModuleStatus()
	const moduleStatusDispatch = useModuleStatusDispatch()

	let status: ModuleStatus, setStatus: React.Dispatch<React.SetStateAction<ModuleStatus>>
	if (header) {
		status = moduleStatus
		setStatus = useCallback((value: React.SetStateAction<ModuleStatus>) => {
			moduleStatusDispatch({
				type: "set",
				moduleStatus: typeof value === "function" ? value(status) : value
			})
		}, [moduleStatusDispatch, status])
	} else {
		[status, setStatus] = useState<ModuleStatus>("attempted")

		useEffect(() => {
			if (moduleStatus !== "custom") setStatus(moduleStatus)
		}, [setStatus, moduleStatus])
	}

	const handleSelectOnInput = useCallback((event: React.InputEvent<HTMLSelectElement>) => {
		setStatus(event.currentTarget.value as ModuleStatus)
		if (!header) moduleStatusDispatch({
			type: "set",
			moduleStatus: "custom"
		})

		// Set global to custom if any select (except the global one) changes
		globalModuleStatusDispatch?.({
			type: "set",
			moduleStatus: "custom"
		})
	}, [setStatus, globalModuleStatusDispatch, !header && moduleStatusDispatch])

	// Update the modules when the status changes
	useEffect(() => {
		onStatusChange?.(status)

		updateModules()
	}, [status])

	return (
		<select value={status} onInput={handleSelectOnInput}>
			{header && <option value="custom" disabled hidden>Custom</option>}
			<option value="not-attempted">Not attempted</option>
			<option value="attempted">Attempted</option>
			<option value="rpl">RPL'd</option>
		</select>
	)
}