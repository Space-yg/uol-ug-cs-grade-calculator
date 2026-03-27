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
			<h1>UoL UG. CS Grade Calculator</h1>

			{/* Select year */}
			<label>
				Year:
				<select value={year} onInput={handleYearOnInput}>
					{years.map(y => <option key={y}>{y}</option>)}
				</select>
			</label>
			<br />

			<DegreesProvider year={year}>
				<ModulesInfoProvider year={year}>
					<App />
				</ModulesInfoProvider>
			</DegreesProvider>
			<br />

			{/* Info */}
			<h2>Help</h2>
			<p>
				Year: this is the year of the regulation that the calculator will calculator the grade based on.
				<br /><br />
				Degree: the degree you are on.
				<br /><br />
				Status: the current status of a module.
			</p>
			<ul>
				<li>Not attempted: you did not attempt this module yet (i.e. you did not take this module yet).</li>
				<li>Attempted: you attempted this module.</li>
				<li>RPL'd: you applied for RPL for this module.</li>
			</ul>
			<p>
				Grade: this is your total weighted grade of the attempted modules only. It will be out of a number. This number is
				the total possible grade you can get of the attempted modules (i.e. if you got 100 in all attempted modules).
				Converting this grade into a percentage gives a good estimate of your performance so far, and which classification
				you might end in when you graduate.
				<br /><br />
				Total grade: this is your total weighted grade so far in the degree of all attempted and not attempted modules.
				Not attempted modules have 0 grade, so <b>this will be a low number</b> if (on BSc.) you only input level 4 and
				level 5 modules, which is normal and you don't need to worry much.
			</p>
		</>
	)
}
