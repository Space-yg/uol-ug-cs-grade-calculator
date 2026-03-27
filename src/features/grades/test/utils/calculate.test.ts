import { describe, expect, test } from "vitest"
import { calculateTotalGrade, calculateGradeOutOf, addModuleInfoToModules } from "$/utils/calculate"

import type { Module, ModuleCode } from "@/types"
import type { useModules } from "@/contexts/Modules"

const modulesInfo: Module[] = [
	{
		abbreviation: "L4M1",
		code: "ab0001" as ModuleCode,
		credits: 15,
		level: 4,
		name: "L4M1",
	},
	{
		abbreviation: "L4M2",
		code: "ab0002" as ModuleCode,
		credits: 15,
		level: 4,
		name: "L4M2",
	},
	{
		abbreviation: "L4M3",
		code: "ab0003" as ModuleCode,
		credits: 15,
		level: 4,
		name: "L4M3",
	},
	{
		abbreviation: "L4M4",
		code: "ab0004" as ModuleCode,
		credits: 15,
		level: 4,
		name: "L4M4",
	},
	{
		abbreviation: "L5M1",
		code: "ab0101" as ModuleCode,
		credits: 15,
		level: 5,
		name: "L5M1",
	},
	{
		abbreviation: "L5M2",
		code: "ab0102" as ModuleCode,
		credits: 15,
		level: 5,
		name: "L5M2",
	},
	{
		abbreviation: "L5M3",
		code: "ab0103" as ModuleCode,
		credits: 15,
		level: 5,
		name: "L5M3",
	},
	{
		abbreviation: "L5M4",
		code: "ab0104" as ModuleCode,
		credits: 15,
		level: 5,
		name: "L5M4",
	},
	{
		abbreviation: "L6M1",
		code: "ab0201" as ModuleCode,
		credits: 15,
		level: 6,
		name: "L6M1",
	},
	{
		abbreviation: "L6M2",
		code: "ab0202" as ModuleCode,
		credits: 15,
		level: 6,
		name: "L6M2",
	},
	{
		abbreviation: "L6M3",
		code: "ab0203" as ModuleCode,
		credits: 30,
		level: 6,
		name: "L6M3",
	},
]

function moduleCode(code: string): ModuleCode {
	return code as ModuleCode
}

const modules: ReturnType<typeof useModules> = {
	[moduleCode("ab0001")]: {
		grade: 100,
		status: "attempted",
	},
	[moduleCode("ab0002")]: {
		grade: 80,
		status: "attempted",
	},
	[moduleCode("ab0003")]: {
		grade: 60,
		status: "rpl",
	},
	[moduleCode("ab0004")]: {
		grade: 40,
		status: "not-attempted",
	},
	[moduleCode("ab0101")]: {
		grade: 40,
		status: "attempted",
	},
	[moduleCode("ab0102")]: {
		grade: 60,
		status: "not-attempted",
	},
	[moduleCode("ab0103")]: {
		grade: 80,
		status: "attempted",
	},
	[moduleCode("ab0104")]: {
		grade: 100,
		status: "rpl",
	},
	[moduleCode("ab0201")]: {
		grade: 100,
		status: "attempted",
	},
	[moduleCode("ab0202")]: {
		grade: 75,
		status: "not-attempted",
	},
	[moduleCode("ab0203")]: {
		grade: 50,
		status: "attempted",
	},
}

const allLevelsAllModulesInfo = addModuleInfoToModules(modulesInfo, modules)
const level4AllModulesInfo = allLevelsAllModulesInfo.filter(module => module.level === 4)
const level5AllModulesInfo = allLevelsAllModulesInfo.filter(module => module.level === 5)
const level6AllModulesInfo = allLevelsAllModulesInfo.filter(module => module.level === 6)
const level4AllAnd5ModulesInfo = allLevelsAllModulesInfo.filter(module => module.level === 4 || module.level === 5)
const level4AllAnd6ModulesInfo = allLevelsAllModulesInfo.filter(module => module.level === 4 || module.level === 6)
const level5AllAnd6ModulesInfo = allLevelsAllModulesInfo.filter(module => module.level === 5 || module.level === 6)

const bscLevelsWeights: Record<string, number> = {
	"4": 1,
	"5": 3,
	"6": 5,
}

const GradCertAndGradDipLevelsWeights: Record<string, number> = {
	"5": 1,
	"6": 1,
}

describe("Calculate grade and grade out of", () => {
	const allModulesInfos = [
		{ allModulesInfo: level4AllModulesInfo, levels: [4] },
		{ allModulesInfo: level5AllModulesInfo, levels: [5] },
		{ allModulesInfo: level6AllModulesInfo, levels: [6] },
		{ allModulesInfo: level4AllAnd5ModulesInfo, levels: [4, 5] },
		{ allModulesInfo: level4AllAnd6ModulesInfo, levels: [4, 6] },
		{ allModulesInfo: level5AllAnd6ModulesInfo, levels: [5, 6] },
		{ allModulesInfo: allLevelsAllModulesInfo, levels: [4, 5, 6] },
	]

	describe.for([
		bscLevelsWeights,
		GradCertAndGradDipLevelsWeights,
	])("Level weights: %o", (levelsWeights) => {
		// Filter by the levels of the level weights
		describe.for(allModulesInfos.filter(({ levels }) => levels.every(level => level in levelsWeights)))("Levels $levels", ({ allModulesInfo }) => {
			test("Total grade", () => {
				// Remove rpl status modules
				const totalGradeAllModulesInfo = allModulesInfo.filter(module => ["attempted", "not-attempted"].includes(module.status))

				// Actual
				const totalModulesGrades = totalGradeAllModulesInfo.reduce((prev, module) => prev + module.credits * levelsWeights[module.level] * module.grade, 0)
				const totalModulesCredits = totalGradeAllModulesInfo.reduce((prev, module) => prev + module.credits * levelsWeights[module.level], 0)
				const actualGrade = totalModulesGrades / totalModulesCredits

				// Predicted
				const predictedTotalGrade = calculateTotalGrade(allModulesInfo, levelsWeights, ["attempted", "not-attempted"])

				expect(predictedTotalGrade).toBe(actualGrade)
			})

			test("Grade", () => {
				// Remove rpl and not-attempted status modules
				const gradeAllModulesInfo = allModulesInfo.filter(module => module.status === "attempted")

				// Actual
				const totalModulesGrades = gradeAllModulesInfo.reduce((prev, module) => prev + module.credits * levelsWeights[module.level] * module.grade, 0)
				const totalModulesCredits = gradeAllModulesInfo.reduce((prev, module) => prev + module.credits * levelsWeights[module.level], 0)
				const actualGrade = totalModulesGrades / totalModulesCredits

				// Predicted
				const predictedGrade = calculateTotalGrade(allModulesInfo, levelsWeights, "attempted")

				expect(predictedGrade).toBe(actualGrade)
			})

			test("Grade out of", () => {
				const attemptedAllModulesInfo = allModulesInfo.filter(module => module.status === "attempted")
				const allAllModulesInfo = allModulesInfo.filter(module => ["attempted", "not-attempted"].includes(module.status))

				// Actual
				const attemptedTotalCredits = attemptedAllModulesInfo.reduce((prev, module) => prev + module.credits * levelsWeights[module.level], 0)
				const allTotalCredits = allAllModulesInfo.reduce((prev, module) => prev + module.credits * levelsWeights[module.level], 0)
				const actualGradeOutOf = attemptedTotalCredits / allTotalCredits * 100

				// Predicted
				const predictedGradeOutOf = calculateGradeOutOf(allModulesInfo, levelsWeights)

				expect(predictedGradeOutOf).toBe(actualGradeOutOf)
			})

			describe("All modules are not-attempted", () => {
				test("Grade", () => {
					const notAttemptedAllModulesInfo = allModulesInfo.filter(module => module.status === "not-attempted")

					expect(calculateTotalGrade(notAttemptedAllModulesInfo, bscLevelsWeights, "attempted")).toBe(0)
				})

				test("Grade out of", () => {
					const notAttemptedAllModulesInfo = allModulesInfo.filter(module => module.status === "not-attempted")

					expect(calculateGradeOutOf(notAttemptedAllModulesInfo, bscLevelsWeights)).toBe(0)
				})
			})

			describe("All modules are RPL", () => {
				test("Total grade", () => {
					const notAttemptedAllModulesInfo = allModulesInfo.filter(module => module.status === "rpl")

					expect(calculateTotalGrade(notAttemptedAllModulesInfo, bscLevelsWeights, ["attempted", "not-attempted"])).toBe(0)
				})

				test("Grade", () => {
					const notAttemptedAllModulesInfo = allModulesInfo.filter(module => module.status === "rpl")

					expect(calculateTotalGrade(notAttemptedAllModulesInfo, bscLevelsWeights, "attempted")).toBe(0)
				})

				test("Grade out of", () => {
					const notAttemptedAllModulesInfo = allModulesInfo.filter(module => module.status === "rpl")

					expect(calculateGradeOutOf(notAttemptedAllModulesInfo, bscLevelsWeights)).toBe(0)
				})
			})
		})
	})

	describe("Edge cases", () => {
		describe.for([
			bscLevelsWeights,
			GradCertAndGradDipLevelsWeights,
		])("Level weights: %o", (levelsWeights) => {
			describe("No modules", () => {
				test("Total grade", () => {
					expect(calculateTotalGrade([], levelsWeights, ["attempted", "not-attempted"])).toBe(0)
				})

				test("Grade", () => {
					expect(calculateTotalGrade([], levelsWeights, "attempted")).toBe(0)
				})

				test("Total grade", () => {
					expect(calculateGradeOutOf([], levelsWeights)).toBe(0)
				})
			})
		})
	})
})