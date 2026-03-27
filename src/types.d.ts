type Brand<T, brand extends string> = T & {
	[brand: symbol]: brand
}

export type ModuleStatus = "custom" | "attempted" | "not-attempted" | "rpl"

export type ModuleCode = Brand<string, "module code">

export type Module = {
	code: ModuleCode
	name: string
	abbreviation: string
	level: number
	credits: number
}

export type ChooseModuleType = {
	type: "choose"
	"max-amount": number
	modules: ModuleCode[]
}

export type SpecialismAbbreviation = Brand<string, "specialism abbreviation">

export type Specialism = {
	name: string
	abbreviation: SpecialismAbbreviation
}

export type Degree = {
	name: string
	shortname: string
	abbreviation: string
	specialism: SpecialismAbbreviation | null
	"levels-weights": {
		[level: string]: number
	}
	"module-types": {
		[type: string]: ModuleCode[]
	}
	"required-modules": (ModuleCode | ChooseModuleType)[]
}