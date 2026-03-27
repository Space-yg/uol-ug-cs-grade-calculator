import { useCallback, useState } from "react"
import App from "./App"
import { DegreesProvider } from "@/contexts/Degrees"
import { useYears } from "@/contexts/Years"
import { ModulesInfoProvider } from "@/contexts/ModulesInfo"

type Props = {}

export default function AppWrapper({ }: Props) {
	const years = useYears()
	const [year, setYear] = useState<string>(years[0])

	const handleYearOnInput = useCallback((event: React.InputEvent<HTMLSelectElement>) => {
		setYear(event.currentTarget.value)
	}, [])

	return (
		<>
			{/* Select year */}
			<label>
				Year:
				<select value={year} onInput={handleYearOnInput}>
					{years.map(y => <option key={y}>{y}</option>)}
				</select>
			</label>
			<br /><br />

			<DegreesProvider year={year}>
				<ModulesInfoProvider year={year}>
					<App />
				</ModulesInfoProvider>
			</DegreesProvider>
		</>
	)
}
