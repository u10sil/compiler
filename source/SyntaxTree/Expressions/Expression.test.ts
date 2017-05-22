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
import * as Tokens from "../../Tokens"
import * as SyntaxTree from "../"

import Is = Unit.Is
export class AssignmentTest extends Unit.Fixture {
	constructor() {
		super("SyntaxTree.Expressions.Assignment")
		var handler = new Error.ConsoleHandler()
		this.add("character literal", () => {
			var parser = new SyntaxTree.Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader("a = 'b'"), handler)), handler)
			var statements = parser.next().getStatements()
			var result = <SyntaxTree.Expressions.Assignment>statements.next()
			this.expect(result.getLeft().getName(), Is.equal.to("a"))
			this.expect((<SyntaxTree.Expressions.Literal.Character>result.getRight()).getValue(), Is.equal.to("b"))
		})
		this.add("number literal", () => {
			var parser = new SyntaxTree.Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader("a = 12345"), handler)), handler)
			var statements = parser.next().getStatements()
			var result = <SyntaxTree.Expressions.Assignment>statements.next()
			this.expect(result.getLeft().getName(), Is.equal.to("a"))
			this.expect((<SyntaxTree.Expressions.Literal.Number>result.getRight()).getValue(), Is.equal.to(12345))
		})
		this.add("variable", () => {
			var parser = new SyntaxTree.Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader("a = b"), handler)), handler)
			var statements = parser.next().getStatements()
			var result = <SyntaxTree.Expressions.Assignment>statements.next()
			this.expect(result.getLeft().getName(), Is.equal.to("a"))
			this.expect((<SyntaxTree.Expressions.Identifier>result.getRight()).getName(), Is.equal.to("b"))
		})
	}
}
Unit.Fixture.add(new AssignmentTest())
