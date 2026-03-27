import { useCallback, useRef } from "react"
import { useModulesInfo } from "@/contexts/ModulesInfo"
import { getModule } from "$/utils/helpers"
import ChooseRequiredModule from "$/components/ChooseRequiredModule/ChooseRequiredModule"
import GradeInput from "$/components/GradeInput/GradeInput"
import StatusSelect from "$/components/StatusSelect/StatusSelect"

import type { Degree, ModuleStatus } from "@/types"
import type { useModuleStatusDispatch } from "$/contexts/ModuleStatus"

type Props = {
	requiredModuleCode: Degree["required-modules"][number]
	globalModuleStatusDispatch: ReturnType<typeof useModuleStatusDispatch>
	updateModules: () => void
}

export default function RequiredModule({ requiredModuleCode, globalModuleStatusDispatch, updateModules }: Props) {
	const modulesInfo = useModulesInfo()
	const gradeInput = useRef<HTMLInputElement>(null)

	// This is a OneOfRule required module
	if (typeof requiredModuleCode !== "string") {
		switch (requiredModuleCode.type) {
			case "choose":
				return <ChooseRequiredModule oneOfRequiredModuleCode={requiredModuleCode} globalModuleStatusDispatch={globalModuleStatusDispatch} updateModules={updateModules} />
			default:
				throw new TypeError(`Unknown "required-modules" type: ${requiredModuleCode.type}`)
		}
	}

	const handleOnStatusChange = useCallback((status: ModuleStatus) => {
		if (gradeInput.current) {
			// Reset input and disable if the status is not attempted
			if (status !== "attempted") {
				gradeInput.current.value = ""
				gradeInput.current.disabled = true
			} else {
				gradeInput.current.disabled = false
			}
		}
	}, [])

	return (
		<tr className={`level-${getModule(modulesInfo, requiredModuleCode)!.level} module`}>
			{/* Code */}
			<td className="code">{requiredModuleCode}</td>

			{/* Name */}
			<td className="name">
				{getModule(modulesInfo, requiredModuleCode)!.name}
			</td>

			{/* Status */}
			<td className="status">
				<StatusSelect globalModuleStatusDispatch={globalModuleStatusDispatch} updateModules={updateModules} onStatusChange={handleOnStatusChange} />
			</td>

			{/* Grade */}
			<td className="grade">
				<GradeInput ref={gradeInput} handleGradeOnInput={updateModules} />
			</td>
		</tr>
	)
}