// Copyright (C) 2017  Simon Mika <simon@mika.se>
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

import { Error } from "@cogneco/mend"
import * as SyntaxTree from "../SyntaxTree"
import * as Parser from "./"

describe("Parser.FunctionCall", () => {
	const handler = new Error.ConsoleHandler()
	it("function()", () => {
		const result = Parser.parseFirst("function()", handler)
		expect(result).toBeTruthy()
		expect(SyntaxTree.filterId(result!.serialize())).toEqual({
			class: "functionCall",
			function: { class: "identifier", name: "function"},
		})
	})
	it("function(a)", () => {
		const result = Parser.parseFirst("function(a)", handler)
		expect(result).toBeTruthy()
		expect(SyntaxTree.filterId(result!.serialize())).toEqual({
			class: "functionCall",
			function: { class: "identifier", name: "function"},
			arguments: [
				{ class: "identifier", name: "a" },
			],
		})
	})
	it("function(a, b)", () => {
		const result = Parser.parseFirst("function(a, b)", handler)
		expect(result).toBeTruthy()
		expect(SyntaxTree.filterId(result!.serialize())).toEqual({
			class: "functionCall",
			function: { class: "identifier", name: "function"},
			arguments: [
				{ class: "identifier", name: "a" },
				{ class: "identifier", name: "b" },
			],
		})
	})
	it("c.m(a, b)", () => {
		const result = Parser.parseFirst("c.m(a, b)", handler)
		expect(result).toBeTruthy()
		expect(SyntaxTree.filterId(result!.serialize())).toEqual({
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
		})
	})
})
