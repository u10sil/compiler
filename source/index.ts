// Copyright (C) 2015, 2017  Simon Mika <simon@mika.se>
//
// This file is part of U10sil.
//
// U10sil is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// U10sil is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with U10sil.  If not, see <http://www.gnu.org/licenses/>.
//

import { Error, Uri, Utilities } from "@cogneco/mend"
import * as Parser from "./Parser"
import * as Resolver from "./Resolver"
import * as ES from "./ES2017"

export class Program {
	readonly version = "0.1.1"
	private defaultCommand = "build"
	constructor(private commands: (string | undefined)[]) {
		this.commands = this.commands.slice(2)
		if (this.commands.length == 0) {
			this.commands.push(this.defaultCommand)
			this.commands.push(".")
		}
	}
	private async runHelper(command: string | undefined, commands: (string | undefined)[]) {
		const handler = new Error.ConsoleHandler()
		switch (command) {
			case "compile":
				{
					const resource = Uri.Locator.parse(commands.pop())
					if (!resource)
						handler.raise("Missing path to open.", Error.Level.Critical, "usage")
					else {
						const parser = Parser.open(resource, handler)
						if (!parser)
							handler.raise("Failed to open " + resource.toString() + ".", Error.Level.Critical, "parser")
						else {
							const modules = Utilities.Enumerable.from(parser.toArray())
							const [declarations, types] = Resolver.resolve(handler, modules)
							const cCode = new ES.Converter(declarations, types, handler).convert(modules)
							const generator = await ES.Generator.create(resource.folder, handler)
							if (!(generator && await generator.generate(cCode)))
								handler.raise("Failed to generate output to " + resource.folder.toString() + ".", Error.Level.Critical, "generate")
						}
					}
				}
				break
			case "es-json":
				{
					const resource = Uri.Locator.parse(commands.pop())
					const parser = Parser.open(resource, handler)
					if (parser) {
						const modules = Utilities.Enumerable.from(parser.toArray())
						const [declarations, types] = Resolver.resolve(handler, modules)
						const cCode = new ES.Converter(declarations, types, handler).convert(modules)
						console.log(JSON.stringify(cCode.map(m => m.serialize()).toArray(), undefined, "\t"))
					}
				}
				break
			case "json":
				{
					const resource = Uri.Locator.parse(commands.pop())
					const parser = Parser.open(resource, handler)
					if (parser) {
						const modules = Utilities.Enumerable.from(parser.toArray())
						const [declarations, types] = Resolver.resolve(handler, modules)
						let result = modules.map(module => module.serialize()).toArray()
						result = declarations.patch(result)
						result = types.patch(result)
						console.log(JSON.stringify(result, undefined, "\t"))
					}
				}
				break
			case "version":
				console.log("u10sil " + this.version)
				break
			case "help":
				console.log("help")
				break
			default:
				commands.push(command)
				command = undefined
				this.runHelper(this.defaultCommand, commands)
				break
		}
		if (command)
			this.defaultCommand = command
	}
	run() {
		let command: string | undefined
		while (command = this.commands.shift()) {
			this.runHelper(command, this.commands)
		}
	}
}

const u10sil = new Program(process.argv)
u10sil.run()
console.error("u10sil " + u10sil.version)
