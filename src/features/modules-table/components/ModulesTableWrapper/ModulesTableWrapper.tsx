import ModulesTable from "$/components/ModulesTable/ModulesTable"
import { ModuleStatusProvider } from "$/contexts/ModuleStatus"

import type { Props as ModulesTableProps } from "$/components/ModulesTable/ModulesTable"

type Props = ModulesTableProps & {}

export default function ModulesTableWrapper(props: Props) {
	return (
		<ModuleStatusProvider global>
			<ModulesTable {...props} />
		</ModuleStatusProvider>
	)
}