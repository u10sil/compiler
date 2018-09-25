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
import * as SyntaxTree from "../../SyntaxTree"
import * as Parser from "../"

describe("Parser.Expressions.Literal.Number", () => {
	const handler = new Error.ConsoleHandler()
	it("integer", () => {
		const parser = Parser.create("12345", handler)
		const statements = parser.fetch()!.statements.getEnumerator()
		const literal = statements.fetch()
		expect(literal instanceof SyntaxTree.Literal.Number).toBeTruthy()
		expect((literal as SyntaxTree.Literal.Number).value).toEqual(12345)
		expect(SyntaxTree.filterId(literal!.serialize())).toEqual({ class: "literal.number", value: 12345 })
	})
	it("float", () => {
		const literal = Parser.parseFirst("0.1234", handler)
		expect(literal instanceof SyntaxTree.Literal.Number).toBeTruthy()
		expect((literal as SyntaxTree.Literal.Number).value).toEqual(0.1234)
		expect(SyntaxTree.filterId(literal!.serialize())).toEqual({ class: "literal.number", value: 0.1234 })
	})
	it("binary", () => {
		const literal = Parser.parseFirst("0b11000000111001", handler)
		expect(literal instanceof SyntaxTree.Literal.Number).toBeTruthy()
		expect((literal as SyntaxTree.Literal.Number).value).toEqual(12345)
		expect(SyntaxTree.filterId(literal!.serialize())).toEqual({ class: "literal.number", value: 12345 })
	})
	it("octal", () => {
		const literal = Parser.parseFirst("0c30071", handler)
		expect(literal instanceof SyntaxTree.Literal.Number).toBeTruthy()
		expect((literal as SyntaxTree.Literal.Number).value).toEqual(12345)
		expect(SyntaxTree.filterId(literal!.serialize())).toEqual({ class: "literal.number", value: 12345 })
	})
	it("hexadecimal", () => {
		const literal = Parser.parseFirst("0xD431", handler)
		expect(literal instanceof SyntaxTree.Literal.Number).toBeTruthy()
		expect((literal as SyntaxTree.Literal.Number).value).toEqual(54321)
		expect(SyntaxTree.filterId(literal!.serialize())).toEqual({ class: "literal.number", value: 54321 })
	})
	it("typed object", () => {
		const parser = Parser.create("Class 12345", handler)
		const statements = parser.fetch()!.statements.getEnumerator()
		const literal = statements.fetch()
		expect(literal).toBeInstanceOf(SyntaxTree.Literal.TypedObject)
		expect(SyntaxTree.filterId(literal!.serialize())).toEqual({ class: "literal.typedObject", name: { class: "identifier", name: "Class" }, value: { class: "literal.number", value: 12345 } })
	})
})
