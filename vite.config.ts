/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from "fs"

import type { ResolverFunction } from 'vite'

function inPages(path: string): string | null {
	return /(\w|\/|:| |-)+\/pages\/\w+/.exec(path)?.[0] ?? null
}

const pagesLocalImport: (path: string, hasIndex?: boolean) => ResolverFunction = (path, hasIndex = false) => (source, importer, options) => {
	// console.log("!!!!!!!!!!!!!!!!! HERE !!!!!!!!!!!!!!!!!")
	// console.log("source:", source)
	// console.log("importer:", /(\w|\/|:| |-)+\/pages\/\w+/.exec(importer!)![0])
	// console.log("Importing:", /(\w|\/|:| |-)+\/pages\/\w+/.exec(importer!)![0] + path + source + (hasIndex ? "/index.tsx" : ".tsx"))
	return /(\w|\/|:| |-)+\/pages\/\w+/.exec(importer!)![0] + path + source + (hasIndex ? "/index.tsx" : ".tsx")
}

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react(),
		{
			name: "Resolve local imports",
			enforce: "pre",
			resolveId(source, importer, options) {
				if (source.startsWith("$")) {
					// Convert all / (if any) to \\
					// So the path will be C:\Users\...
					importer = path.resolve(importer!)

					// console.log("!!!!!!!!!!!!!!!!! HERE !!!!!!!!!!!!!!!!!")
					// console.log(source, "\n", importer, "\n")

					const importerFolders = importer.split("\\")

					/** `.../features/<feature-name>` */
					const featureFolder = importerFolders.slice(0, importerFolders.indexOf("features") + 2).join("/")

					/** `<filename>` */
					const sourceFilename = source.split("/").at(-1)!
					/** `[<filenameWithExtension>, <filenameWithExtension>, ...]` */
					const filesInSourceFolder = fs.readdirSync(path.join(importerFolders.slice(0, importerFolders.indexOf("features") + 2).join("/"), source.split("/").slice(1, -1).join("/")))
					/** `<filename>.<extension>` */
					const sourceFilenameWithExtension = filesInSourceFolder.find(file => file.split(".").slice(0, -1).join(".") === sourceFilename)!

					// console.log(importerFolders.slice(0, importerFolders.indexOf("features") + 2).join("/"))
					// console.log(path.join(importerFolders.slice(0, importerFolders.indexOf("features") + 2).join("/"), source.split("/").slice(1, -1).join("/"), sourceFilenameWithExtension))
					return path.join(featureFolder, source.split("/").slice(1, -1).join("/"), sourceFilenameWithExtension)
				}
			},

		}
	],
	resolve: {
		alias: [
			// Global
			{ find: "@/components", replacement: path.resolve(__dirname, "./src/components") },
			{ find: "@/features", replacement: path.resolve(__dirname, "./src/features") },
			{ find: "@/contexts", replacement: path.resolve(__dirname, "./src/contexts") },

			// Local
			// { find: "!/contexts", replacement: "", customResolver: pagesLocalImport("/contexts") },

			// Extra local
			// { find: "$/features", replacement: "", customResolver: localImport("features", "/contexts") },
		],
	},
	base: "/uol-ug-cs-grade-calculator",
	// test: {}
})
