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

describe("Parser.PostfixOperator", () => {
	const handler = new Error.ConsoleHandler()
	it("a--", () => {
		const result = Parser.parseFirst("a--", handler)
		expect(result).toBeTruthy()
		expect(SyntaxTree.filterId(result!.serialize())).toEqual({
			class: "postfixOperator",
			symbol: "--",
			argument: { class: "identifier", name: "a" },
		})
	})
	it("a++", () => {
		const result = Parser.parseFirst("a++", handler)
		expect(result).toBeTruthy()
		expect(SyntaxTree.filterId(result!.serialize())).toEqual({
			class: "postfixOperator",
			symbol: "++",
			argument: { class: "identifier", name: "a" },
		})
	})
	it("a + a--", () => {
		const result = Parser.parseFirst("a + a--", handler)
		expect(result).toBeTruthy()
		expect(SyntaxTree.filterId(result!.serialize())).toEqual({
			class: "infixOperator",
			symbol: "+",
			left: { class: "identifier", name: "a" },
			right: {
				class: "postfixOperator",
				symbol: "--",
				argument: { class: "identifier", name: "a" },
			},
		})
	})
	it("a-- + a", () => {
		const result = Parser.parseFirst("a-- + a", handler)
		expect(result).toBeTruthy()
		expect(SyntaxTree.filterId(result!.serialize())).toEqual({
			class: "infixOperator",
			symbol: "+",
			left: {
				class: "postfixOperator",
				symbol: "--",
				argument: { class: "identifier", name: "a" },
			},
			right: { class: "identifier", name: "a" },
		})
	})
})
