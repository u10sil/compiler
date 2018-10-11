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

import { Error } from "@cogneco/mend"
import * as SyntaxTree from "../SyntaxTree"
import * as Parser from "./"

describe("Parser.InfixOperator", () => {
	const handler = new Error.ConsoleHandler()
	it("a = 'b'", () => {
		const result = Parser.parseFirst("a = \"b\"", handler) as SyntaxTree.InfixOperator
		expect(result.symbol).toEqual("=")
		expect((result.left as SyntaxTree.Identifier).name).toEqual("a")
		expect(result.right).toBeInstanceOf(SyntaxTree.Literal.String)
		expect((result.right as SyntaxTree.Literal.String).value).toEqual("b")
		expect(SyntaxTree.filterId(result.serialize())).toEqual({
			class: "infixOperator",
			symbol: "=",
			left: { class: "identifier", name: "a" },
			right: { class: "literal.string", value: "b" },
		})
	})
	it("a = 12345", () => {
		const result = Parser.parseFirst("a = 12345", handler) as SyntaxTree.InfixOperator
		expect(result.symbol).toEqual("=")
		expect((result.left as SyntaxTree.Identifier).name).toEqual("a")
		expect((result.right as SyntaxTree.Literal.Number).value).toEqual(12345)
		expect(SyntaxTree.filterId(result.serialize())).toEqual({
			class: "infixOperator",
			symbol: "=",
			left: { class: "identifier", name: "a" },
			right: { class: "literal.number", value: 12345 },
		})
	})
	it("a = b", () => {
		const result = Parser.parseFirst("a = b", handler) as SyntaxTree.InfixOperator
		expect(result.symbol).toEqual("=")
		expect((result.left as SyntaxTree.Identifier).name).toEqual("a")
		expect((result.right as SyntaxTree.Identifier).name).toEqual("b")
		expect(SyntaxTree.filterId(result.serialize())).toEqual({
			class: "infixOperator",
			symbol: "=",
			left: { class: "identifier", name: "a" },
			right: { class: "identifier", name: "b" },
		})
	})
	it("a * b + c * d", () => {
		const result = Parser.parseFirst("a * b + c * d", handler) as SyntaxTree.InfixOperator
		expect(SyntaxTree.filterId(result.serialize())).toEqual({
			class: "infixOperator",
			symbol: "+",
			left: {
				class: "infixOperator",
				symbol: "*",
				left: { class: "identifier", name: "a" },
				right: { class: "identifier", name: "b" },
			},
			right: {
				class: "infixOperator",
				symbol: "*",
				left: { class: "identifier", name: "c" },
				right: { class: "identifier", name: "d" },
			},
		})
	})
})
