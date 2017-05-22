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

import { Error, IO, Unit } from "@cogneco/mend"
import * as Tokens from "../../../Tokens"
import * as SyntaxTree from "../../"

import Is = Unit.Is
export class NumberTest extends Unit.Fixture {
	constructor() {
		super("SyntaxTree.Expressions.Literal.Number")
		const handler = new Error.ConsoleHandler()
		this.add("integer", () => {
			const parser = new SyntaxTree.Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader("12345"), handler)), handler)
			const statements = parser.next().statements
			const literal = statements.next()
			this.expect(literal instanceof SyntaxTree.Expressions.Literal.Number, Is.true)
			this.expect((literal as SyntaxTree.Expressions.Literal.Number).value, Is.equal.to(12345))
		})
		this.add("float", () => {
			const parser = new SyntaxTree.Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader("0.1234f"), handler)), handler)
			const statements = parser.next().statements
			const literal = statements.next()
			this.expect(literal instanceof SyntaxTree.Expressions.Literal.Number, Is.true)
			this.expect((literal as SyntaxTree.Expressions.Literal.Number).value, Is.equal.to(0.1234))
		})
		this.add("binary", () => {
			const parser = new SyntaxTree.Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader("0b11000000111001"), handler)), handler)
			const statements = parser.next().statements
			const literal = statements.next()
			this.expect(literal instanceof SyntaxTree.Expressions.Literal.Number, Is.true)
			this.expect((literal as SyntaxTree.Expressions.Literal.Number).value, Is.equal.to(12345))
		})
		this.add("octal", () => {
			const parser = new SyntaxTree.Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader("0c30071"), handler)), handler)
			const statements = parser.next().statements
			const literal = statements.next()
			this.expect(literal instanceof SyntaxTree.Expressions.Literal.Number, Is.true)
			this.expect((literal as SyntaxTree.Expressions.Literal.Number).value, Is.equal.to(12345))
		})
		this.add("hexadecimal", () => {
			const parser = new SyntaxTree.Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader("0xD431"), handler)), handler)
			const statements = parser.next().statements
			const literal = statements.next()
			this.expect(literal instanceof SyntaxTree.Expressions.Literal.Number, Is.true)
			this.expect((literal as SyntaxTree.Expressions.Literal.Number).value, Is.equal.to(54321))
		})
	}
}
Unit.Fixture.add(new NumberTest())
