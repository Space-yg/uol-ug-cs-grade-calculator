import { StrictMode, Suspense } from "react"
import { createRoot } from "react-dom/client"
import App from "./AppWrapper.tsx"
import { YearsProvider } from "@/contexts/Years.tsx"

import "./index.scss"

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<Suspense fallback={<>Loading...</>}>
			<YearsProvider>
				<App />
			</YearsProvider>
		</Suspense>
	</StrictMode>
)
