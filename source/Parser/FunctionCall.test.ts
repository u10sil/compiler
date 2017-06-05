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
export class FunctionCallTest extends Unit.Fixture {
	constructor() {
		super("SyntaxTree.FunctionCall")
		const handler = new Error.ConsoleHandler()
		this.add("function()", () => {
			const result = Parser.parseFirst("function()", handler)
			this.expect(result, Is.not.undefined)
			this.expect(result!.serialize(), Is.equal.to({
				class: "functionCall",
				function: { class: "identifier", name: "function"},
			}))
		})
		this.add("function(a)", () => {
			const result = Parser.parseFirst("function(a)", handler)
			this.expect(result, Is.not.undefined)
			this.expect(result!.serialize(), Is.equal.to({
				class: "functionCall",
				function: { class: "identifier", name: "function"},
				arguments: [
					{ class: "identifier", name: "a" },
				],
			}))
		})
		this.add("function(a, b)", () => {
			const result = Parser.parseFirst("function(a, b)", handler)
			this.expect(result, Is.not.undefined)
			this.expect(result!.serialize(), Is.equal.to({
				class: "functionCall",
				function: { class: "identifier", name: "function"},
				arguments: [
					{ class: "identifier", name: "a" },
					{ class: "identifier", name: "b" },
				],
			}))
		})
		this.add("c.m(a, b)", () => {
			const result = Parser.parseFirst("c.m(a, b)", handler)
			this.expect(result, Is.not.undefined)
			this.expect(result!.serialize(), Is.equal.to({
				class: "functionCall",
				function: {
					class: "infixOperator",
					symbol: ".",
					left: { class: "identifier", name: "c" },
					right: { class: "identifier", name: "m" },
				},
				arguments: [
					{ class: "identifier", name: "a" },
					{ class: "identifier", name: "b" },
				],
			}))
		})
	}
}
Unit.Fixture.add(new FunctionCallTest())
