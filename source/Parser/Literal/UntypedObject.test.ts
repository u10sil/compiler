// Copyright (C) 2018 Simon Mika <simon@mika.se>
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
import * as Parser from ".."

describe("Parser.Expressions.Literals.Object", () => {
	const handler = new Error.ConsoleHandler()
	it("literal", () => {
		const parser = Parser.create("{ property: 1337 }", handler)
		const statements = parser.fetch()!.statements.getEnumerator()
		const literal = statements.fetch()
		expect(literal instanceof SyntaxTree.Literal.UntypedObject).toBeTruthy()
		expect(SyntaxTree.filterId(literal!.serialize())).toEqual({ class: "literal.untypedObject", value: { property: { class: "literal.number", value: 1337 } } })
	})
	it("typed literal", () => {
		const parser = Parser.create("Class { property: 1337 } ", handler)
		const statements = parser.fetch()!.statements.getEnumerator()
		const literal = statements.fetch()
		expect(literal instanceof SyntaxTree.Literal.TypedObject).toBeTruthy()
		expect(SyntaxTree.filterId(literal!.serialize())).toEqual({ class: "literal.typedObject", name: { class: "identifier", name: "Class" }, value: { class: "literal.untypedObject", value: { property: { class: "literal.number", value: 1337 } } } })
	})
})
