// Copyright (C) 2017  Simon Mika <simon@mika.se>
//
// This file is part of SysPL.
//
// SysPL is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// SysPL is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with SysPL.  If not, see <http://www.gnu.org/licenses/>.
//

import { Error, IO, Unit, Uri, Utilities } from "@cogneco/mend";
import * as Tokens from "./Tokens"

export class Program {
	private defaultCommand = "build"
	constructor(private commands: string[]) {
		this.commands = this.commands.slice(2)
		if (this.commands.length == 0) {
			this.commands.push(this.defaultCommand)
			this.commands.push(".")
		}
	}
	private openReader(path: string) {
		return path.slice(-4) == ".syspl" ? new IO.FileReader(path) : new IO.FolderReader(path, "*.syspl")
	}
	private openLexer(path: string, handler: Error.Handler) {
		return new Tokens.GapRemover(new Tokens.Lexer(this.openReader(path), handler))
	}
	private runHelper(command: string, commands: string[]) {
		var handler = new Error.ConsoleHandler()
		switch (command) {
			case "build":
				console.log("build")
				new Tokens.Consumer(this.openLexer(commands.pop(), handler)).run()
				break
			case "self-test":
				process.exitCode = Unit.Fixture.run() ? 0 : 1
				break
			case "version":
				console.log("syspl " + this.getVersion())
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
		var command: string
		while (command = this.commands.shift()) {
			this.runHelper(command, this.commands)
		}
	}
	getVersion(): string {
		return "0.2"
	}
}

try {
	var syspl = new Program(process.argv)
	syspl.run()
	console.log("syspl " + syspl.getVersion())
} catch (Error) {
	console.log(Error.toString())
}
