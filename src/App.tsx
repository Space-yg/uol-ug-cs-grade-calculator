import { useCallback, useState } from "react"
import { useDegrees } from "@/contexts/Degrees"
import { ModulesProvider } from "@/contexts/Modules"
import ModulesTable from "@/features/modules-table"
import Grades from "@/features/grades"

import "./App.scss"

type Props = {}

export default function App({ }: Props) {
	const degrees = useDegrees()
	const [degree, setDegree] = useState(degrees[0])

	const handleDegreeOnInput = useCallback((event: React.InputEvent<HTMLSelectElement>) => {
		setDegree(degrees.find(d => d.shortname === event.currentTarget.value)!)
	}, [])

	return (
		<>
			{/* Select degree */}
			<label>
				Degree:
				<select value={degree.shortname} onInput={handleDegreeOnInput}>
					{degrees.map(d => <option key={d.abbreviation}>{d.shortname}</option>)}
				</select>
			</label>
			<br />

			<ModulesProvider>
				{/* Modules table */}
				<ModulesTable degree={degree} />
				<br />

				{/* Grade */}
				<Grades degree={degree} />
			</ModulesProvider>
		</>
	)
}
