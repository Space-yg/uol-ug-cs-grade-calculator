import { useCallback, useEffect, useRef, useState } from "react"
import { useModulesInfo } from "@/contexts/ModulesInfo"
import { getModule } from "$/utils/helpers"
import GradeInput from "$/components/GradeInput/GradeInput"
import StatusSelect from "$/components/StatusSelect/StatusSelect"

import type { ModuleCode, ChooseModuleType, ModuleStatus } from "@/types"
import type { useModuleStatusDispatch } from "$/contexts/ModuleStatus"

type Props = {
	oneOfRequiredModuleCode: ChooseModuleType
	globalModuleStatusDispatch: ReturnType<typeof useModuleStatusDispatch>
	updateModules: () => void
}

export default function ChooseRequiredModule({ oneOfRequiredModuleCode, globalModuleStatusDispatch, updateModules }: Props) {
	const modulesInfo = useModulesInfo()

	// Selected modules
	const [selectedModules, setSelectedModules] = useState<ModuleCode[]>(oneOfRequiredModuleCode.modules.slice(0, oneOfRequiredModuleCode["max-amount"]))

	function handleNameOnSelect(event: React.InputEvent<HTMLSelectElement>, index: number) {
		const newSelectedModules = [...selectedModules]
		newSelectedModules[index] = event.currentTarget.value as ModuleCode
		setSelectedModules(newSelectedModules)
	}

	// Update the modules when the selected modules change
	useEffect(() => {
		updateModules()
	}, [selectedModules])

	return selectedModules.map((selectedModule, idx) => {
		const gradeInput = useRef<HTMLInputElement>(null)

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
		}, [gradeInput])

		return <tr key={idx} className={`level-${getModule(modulesInfo, oneOfRequiredModuleCode.modules[0])!.level} module`}>
			{/* Code */}
			<td className="code">{selectedModule}</td>

			{/* Name */}
			<td className="name">
				<select value={selectedModule} onInput={e => handleNameOnSelect(e, idx)}>
					{oneOfRequiredModuleCode.modules
						.filter(requiredModule => !selectedModules.includes(requiredModule) || requiredModule === selectedModule) // Keep the ones that are selected and self
						.map(requiredModule => <option key={requiredModule} value={requiredModule}>{getModule(modulesInfo, requiredModule)!.name}</option>)
					}
				</select>
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
	})
}