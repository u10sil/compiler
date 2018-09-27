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

describe("Parser.Expressions.Literals.StringLiteral", () => {
	const handler = new Error.ConsoleHandler()
	it("literal", () => {
		const literal = Parser.parseFirst("\"\\\"string\\\"\"", handler)
		expect(literal).toBeInstanceOf(SyntaxTree.Literal.String)
		expect((literal as SyntaxTree.Literal.String).value).toEqual("\"string\"")
		expect(SyntaxTree.filterId(literal!.serialize())).toEqual({ class: "literal.string", value: "\"string\"" })
	})
	it("typed object literal", () => {
		const literal = Parser.parseFirst("Class \"string\"", handler)
		expect(literal instanceof SyntaxTree.Literal.TypedObject).toBeTruthy()
		expect(SyntaxTree.filterId(literal!.serialize())).toEqual({ class: "literal.typedObject", name: { class: "type.identifier", name: "Class" }, value: { class: "literal.string", value: "string" } })
	})
})
