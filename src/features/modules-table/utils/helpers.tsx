import type { Degree, Module, ModuleCode } from "@/types"

/**
 * Convert a required module to a string. This requires the same module code or requires the first module code of the `OneOfRule`.
 * This is used in the `key` property in components or to get the first module code always.
 * @param moduleCode The module to convert
 * @returns The module code
 */
export function requiredModuleToString(moduleCode: Degree["required-modules"][number]): ModuleCode {
	if (typeof moduleCode === "string") return moduleCode

	switch (moduleCode.type) {
		case "choose":
			return moduleCode.modules[0]
		default:
			throw new TypeError(`Unknown "required-modules" type: ${moduleCode.type}`)
	}
}

/**
 * Get a module from based on the module code
 * @param modules The modules to search through
 * @param moduleCode The module code to search using
 * @returns The module
 */
export function getModule(modules: Module[], moduleCode: ModuleCode): Module | undefined {
	return modules.find(module => module.code === moduleCode)
}