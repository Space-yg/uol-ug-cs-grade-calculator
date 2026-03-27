import { useModules } from "@/contexts/Modules"
import { useModulesInfo } from "@/contexts/ModulesInfo"
import { addModuleInfoToModules, calculateGradeOutOf, calculateTotalGrade } from "$/utils/calculate"

import type { Degree } from "@/types"

import "./styles.scss"

type Props = {
	degree: Degree
}

export default function Grades({ degree }: Props) {
	const modules = useModules()
	const modulesInfo = useModulesInfo()
	const allModulesInfo = addModuleInfoToModules(modulesInfo, modules)

	const grade = Math.round(calculateTotalGrade(allModulesInfo, degree["levels-weights"], "attempted") * 100) / 100
	const gradeOutOf = Math.round(calculateGradeOutOf(allModulesInfo, degree["levels-weights"]) * 100) / 100
	const totalGrade = Math.round(calculateTotalGrade(allModulesInfo, degree["levels-weights"], ["attempted", "not-attempted"]) * 100) / 100

	return (
		<div className="grades">
			<p>Grade: {Math.round(grade * gradeOutOf / 100 * 100) / 100}/{gradeOutOf} or {grade}%/100%</p>
			<p>Total grade: {totalGrade}%/100%</p>
		</div>
	)
}