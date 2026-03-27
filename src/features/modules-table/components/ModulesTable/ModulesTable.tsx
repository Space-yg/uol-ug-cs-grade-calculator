import { useCallback, useEffect, useRef } from "react"
import { useModulesInfo } from "@/contexts/ModulesInfo"
import { useModules, useModulesDispatch } from "@/contexts/Modules"
import { ModuleStatusProvider, useModuleStatusDispatch } from "$/contexts/ModuleStatus"
import { getModule, requiredModuleToString } from "$/utils/helpers"
import RequiredModule from "$/components/RequiredModule/RequiredModule"
import StatusSelect from "$/components/StatusSelect/StatusSelect"

import type { Degree } from "@/types"

import "./styles.scss"

export type Props = {
	degree: Degree
}

export default function ModulesTable({ degree }: Props) {
	const modulesInfo = useModulesInfo()
	const modules = useModules()
	const modulesDispatch = useModulesDispatch()
	const globalModuleStatusDispatch = useModuleStatusDispatch()

	const tableElement = useRef<HTMLTableElement>(null)
	// console.log(modules)

	// Group the modules into their levels
	const levelGroupedRequiredModules = degree["required-modules"].reduce<[level: number, modules: typeof degree["required-modules"]][]>((arr, moduleCode) => {
		const level = getModule(modulesInfo, requiredModuleToString(moduleCode))!.level

		let levelModules = arr.find(([l, ms]) => level === l)
		if (typeof levelModules === "undefined") {
			arr.push([level, []])
			levelModules = arr.at(-1)!
		}

		levelModules[1].push(moduleCode)

		return arr
	}, [])

	const updateModules = useCallback(() => {
		modulesDispatch({
			type: "update",
			table: tableElement.current!
		})
	}, [modulesDispatch])

	// Update the modules on load
	useEffect(() => {
		updateModules()
	}, [updateModules])

	return (
		<div>
			<table className="modules-table" ref={tableElement}>
				<thead>
					<tr>
						<th>Level</th>
						<th>Code</th>
						<th>Name</th>
						<th>Status <StatusSelect header updateModules={updateModules} /></th>
						<th>Grade</th>
					</tr>
				</thead>
				<tbody>
					{levelGroupedRequiredModules.map(([level, modules]) => (
						<ModuleStatusProvider key={level}>
							<tr className={`level-${level} level`}>
								<td rowSpan={modules.length + modules.reduce((prev, module) => prev + (typeof module === "string" ? 0 : module["max-amount"] - 1), 0) + 2}>{level}</td>
							</tr>
							<tr className={`level-${level}`}>
								<td colSpan={4} style={{ textAlign: "center" }}><StatusSelect header globalModuleStatusDispatch={globalModuleStatusDispatch} updateModules={updateModules} /></td>
							</tr>
							{modules.map(module => (
								<RequiredModule
									// key: rerender the choose modules. This prevents it from rerendering the same choose module component when switching between degrees
									key={typeof module === "string" ? module : module.modules.reduce((prev, module) => prev + module, "")}
									requiredModuleCode={module}
									globalModuleStatusDispatch={globalModuleStatusDispatch}
									updateModules={updateModules}
								/>
							))}
						</ModuleStatusProvider>
					))}
				</tbody>
			</table>
		</div>
	)
}