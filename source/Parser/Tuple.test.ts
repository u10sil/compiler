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

import { Error } from "@cogneco/mend"
import * as SyntaxTree from "../SyntaxTree"
import * as Parser from "./"

describe("Parser.Tuple", () => {
	const handler = new Error.ConsoleHandler()
	it("(a, b)", () => {
		const result = Parser.parseFirst("(a, b)", handler)
		expect(result).toBeTruthy()
		expect(SyntaxTree.filterId(result!.serialize())).toEqual({
			class: "tuple",
			elements: [
				{ class: "identifier", name: "a" },
				{ class: "identifier", name: "b" },
			],
		})
	})
	it("(a, b, (c, d))", () => {
		const result = Parser.parseFirst("(a, b, (c, d))", handler)
		expect(result).toBeTruthy()
		expect(SyntaxTree.filterId(result!.serialize())).toEqual({
			class: "tuple",
			elements: [
				{ class: "identifier", name: "a" },
				{ class: "identifier", name: "b" },
				{
					class: "tuple",
					elements: [
						{ class: "identifier", name: "c" },
						{ class: "identifier", name: "d" },
					],
				},
			],
		})
	})
	it("(a + b) * c", () => {
		const result = Parser.parseFirst("(a + b) * c", handler)
		expect(result).toBeTruthy()
		expect(SyntaxTree.filterId(result!.serialize())).toEqual({
			class: "infixOperator",
			symbol: "*",
			left: {
				class: "infixOperator",
				symbol: "+",
				left: { class: "identifier", name: "a" },
				right:	{ class: "identifier", name: "b" },
			},
			right:	{ class: "identifier", name: "c" },
		})
	})
	it("a * (b + c)", () => {
		const result = Parser.parseFirst("a * (b + c)", handler)
		expect(result).toBeTruthy()
		expect(SyntaxTree.filterId(result!.serialize())).toEqual({
			class: "infixOperator",
			symbol: "*",
			left:	{ class: "identifier", name: "a" },
			right: {
				class: "infixOperator",
				symbol: "+",
				left: { class: "identifier", name: "b" },
				right:	{ class: "identifier", name: "c" },
			},
		})
	})
})
