import type { Module, ModuleStatus } from "@/types"
import type { useModules } from "@/contexts/Modules"

export type AllModuleInfo = Module & {
	grade: number
	status: ModuleStatus
}

export function addModuleInfoToModules(modulesInfo: Module[], modules: ReturnType<typeof useModules>): AllModuleInfo[] {
	return Object.entries(modules).map(([code, module]) => ({
		...module,
		...modulesInfo.find(module => module.code === code)!
	}))
}

/**
 * Calculate the total grade
 * @param modulesLevels The modules to calculate the total grade of. Assuming all modules are attempted expect for rpl
 * @param moduleStatus The status to filter the modules using
 * @param levelCreditsStatus The status to filter the level credits using
 * @returns The total grade of the modules
 */
export function calculateTotalGrade(modules: AllModuleInfo[], levelWeights: Record<string, number>, moduleStatus: ModuleStatus | ModuleStatus[] | null): number {
	// Modules weighted credits = module credit * level weight
	const modulesWeightedCredits: AllModuleInfo[] = modules.map(module => ({
		...module,
		credits: module.credits * levelWeights[module.level]
	}))

	// Modules weighted grades = module grade * module credit
	const modulesWeightedGrades: AllModuleInfo[] = modulesWeightedCredits.map(module => ({
		...module,
		grade: module.grade * module.credits,
	}))

	// Filter the modules weighted grades to calculate
	const modulesWeightedGradesToCalculate: AllModuleInfo[] = modulesWeightedGrades.filter(module =>
		Array.isArray(moduleStatus)
			? moduleStatus.includes(module.status)
			: module.status === moduleStatus
	)

	// No modules to calculate the grade
	if (modulesWeightedGradesToCalculate.length === 0) return 0

	// Total credits = sum(module credit)
	const totalCredits = modulesWeightedGradesToCalculate.reduce((prev, module) => prev + module.credits, 0)
	// Total grades = sum(module grade)
	const totalGrades = modulesWeightedGradesToCalculate.reduce((prev, module) => prev + module.grade, 0)

	// Grade = total grade / total credit
	return totalGrades / totalCredits
}

export function calculateGradeOutOf(modules: AllModuleInfo[], levelWeights: Record<string, number>): number {
	// Modules weighted credits = module credit * level weight
	const modulesWeightedCredits: AllModuleInfo[] = modules.map(module => ({
		...module,
		credits: module.credits * levelWeights[module.level]
	}))

	// Filter modules
	const attemptedModulesWeightedCredits = modulesWeightedCredits.filter(module => module.status === "attempted")
	const allModulesWeightedCredits = modulesWeightedCredits.filter(module => ["attempted", "not-attempted"].includes(module.status))

	// No modules to calculate the grade out of
	if (allModulesWeightedCredits.length === 0) return 0

	// Weighted credits = sum(modules weighted credits)
	const attemptedWeightedCredits = attemptedModulesWeightedCredits.reduce((prev, module) => prev + module.credits, 0)
	const allWeightedCredits = allModulesWeightedCredits.reduce((prev, module) => prev + module.credits, 0)

	// Out of grade = attempted weighted credits / all weighted credits * 100
	return attemptedWeightedCredits / allWeightedCredits * 100
}