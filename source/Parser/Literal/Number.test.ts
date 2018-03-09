// Copyright (C) 2015, 2017  Simon Mika <simon@mika.se>
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
import * as SyntaxTree from "../../SyntaxTree"
import * as Parser from "../"

import Is = Unit.Is
export class NumberTest extends Unit.Fixture {
	constructor() {
		super("Parser.Expressions.Literal.Number")
		const handler = new Error.ConsoleHandler()
		this.add("integer", () => {
			const parser = Parser.create("12345", handler)
			const statements = parser.fetch()!.statements.getEnumerator()
			const literal = statements.fetch()
			this.expect(literal instanceof SyntaxTree.Literal.Number, Is.true)
			this.expect((literal as SyntaxTree.Literal.Number).value, Is.equal.to(12345))
			this.expect(SyntaxTree.filterId(literal!.serialize()), Is.equal.to({ class: "literal.number", value: 12345 }))
		})
		this.add("float", () => {
			const literal = Parser.parseFirst("0.1234", handler)
			this.expect(literal instanceof SyntaxTree.Literal.Number, Is.true)
			this.expect((literal as SyntaxTree.Literal.Number).value, Is.equal.to(0.1234))
			this.expect(SyntaxTree.filterId(literal!.serialize()), Is.equal.to({ class: "literal.number", value: 0.1234 }))
		})
		this.add("binary", () => {
			const literal = Parser.parseFirst("0b11000000111001", handler)
			this.expect(literal instanceof SyntaxTree.Literal.Number, Is.true)
			this.expect((literal as SyntaxTree.Literal.Number).value, Is.equal.to(12345))
			this.expect(SyntaxTree.filterId(literal!.serialize()), Is.equal.to({ class: "literal.number", value: 12345 }))
		})
		this.add("octal", () => {
			const literal = Parser.parseFirst("0c30071", handler)
			this.expect(literal instanceof SyntaxTree.Literal.Number, Is.true)
			this.expect((literal as SyntaxTree.Literal.Number).value, Is.equal.to(12345))
			this.expect(SyntaxTree.filterId(literal!.serialize()), Is.equal.to({ class: "literal.number", value: 12345 }))
		})
		this.add("hexadecimal", () => {
			const literal = Parser.parseFirst("0xD431", handler)
			this.expect(literal instanceof SyntaxTree.Literal.Number, Is.true)
			this.expect((literal as SyntaxTree.Literal.Number).value, Is.equal.to(54321))
			this.expect(SyntaxTree.filterId(literal!.serialize()), Is.equal.to({ class: "literal.number", value: 54321 }))
		})
	}
}
Unit.Fixture.add(new NumberTest())
