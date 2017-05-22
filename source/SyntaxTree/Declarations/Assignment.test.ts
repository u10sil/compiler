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
		super("SyntaxTree.Declarations.Assignment")
		var handler = new Error.ConsoleHandler()
		this.add("a := b", () => {
			var declareAssignStatement = this.createDeclaration("a := b", handler)
			this.expect(declareAssignStatement.left.name, Is.equal.to("a"))
			this.expect((<SyntaxTree.Expressions.Identifier>declareAssignStatement.right).name, Is.equal.to("b"))
		})
		this.add("foo: Type = bar", () => {
			var declareAssignStatement = this.createDeclaration("foo: Type = bar", handler)
			this.expect(declareAssignStatement.left.name, Is.equal.to("foo"))
			this.expect(declareAssignStatement.type.name, Is.equal.to("Type"))
			this.expect((<SyntaxTree.Expressions.Identifier>declareAssignStatement.right).name, Is.equal.to("bar"))
		})
		this.add("foo: Float = 0.50f", () => {
			var declareAssignStatement = this.createDeclaration("f: Float = 0.50f", handler)
			this.expect(declareAssignStatement.left.name, Is.equal.to("f"))
			this.expect(declareAssignStatement.type.name, Is.equal.to("Float"))
			this.expect((<SyntaxTree.Expressions.Literal.Number>declareAssignStatement.right).value, Is.equal.to(0.5))
		})
	}
	createDeclaration(sourceString: string, errorHandler: Error.Handler): SyntaxTree.Declarations.Assignment {
		var parser = new SyntaxTree.Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader(sourceString), errorHandler)), errorHandler)
		var statements = parser.next().statements
		return <SyntaxTree.Declarations.Assignment> statements.next()
	}
}
Unit.Fixture.add(new AssignmentTest())
