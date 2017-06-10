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

import { Error, Unit } from "@cogneco/mend"
import * as Parser from "./"

import Is = Unit.Is
export class ModuleTest extends Unit.Fixture {
	constructor() {
		super("Parser.Module")
		const handler = new Error.ConsoleHandler()
		this.add("simple declaration", () => {
			const module = Parser.create("var i: Int\n", handler).next()!
			this.expect(module.serialize(), Is.equal.to({
				class: "module",
				statements: [
					{ class: "variableDeclaration", symbol: "i", type: { class: "type.identifier", name: "Int" } },
				],
			}))
		})
		this.add("var foo: Float = 0.50", () => {
			const module = Parser.create("var f: Float = 0.50", handler).next()!
			this.expect(module.serialize(), Is.equal.to({
				class: "module",
				statements: [
					{ class: "variableDeclaration", symbol: "f", type: { class: "type.identifier", name: "Float"} , value: { class: "literal.number", value: 0.5 } },
				],
			}))
		})
	}
}
Unit.Fixture.add(new ModuleTest())
