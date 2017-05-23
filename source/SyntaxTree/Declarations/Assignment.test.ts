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
		const handler = new Error.ConsoleHandler()
		this.add("a := b", () => {
			const declareAssignStatement = this.createDeclaration("a := b", handler)
			this.expect(declareAssignStatement.left.name, Is.equal.to("a"))
			this.expect((declareAssignStatement.right as SyntaxTree.Expressions.Identifier).name, Is.equal.to("b"))
		})
		this.add("foo: Type = bar", () => {
			const declareAssignStatement = this.createDeclaration("foo: Type = bar", handler)
			this.expect(declareAssignStatement.left.name, Is.equal.to("foo"))
			this.expect(declareAssignStatement.type.name, Is.equal.to("Type"))
			this.expect((declareAssignStatement.right as SyntaxTree.Expressions.Identifier).name, Is.equal.to("bar"))
		})
		this.add("foo: Float = 0.50f", () => {
			const declareAssignStatement = this.createDeclaration("f: Float = 0.50f", handler)
			this.expect(declareAssignStatement.left.name, Is.equal.to("f"))
			this.expect(declareAssignStatement.type.name, Is.equal.to("Float"))
			this.expect((declareAssignStatement.right as SyntaxTree.Expressions.Literal.Number).value, Is.equal.to(0.5))
		})
	}
	createDeclaration(sourceString: string, handler: Error.Handler): SyntaxTree.Declarations.Assignment {
		const parser = new SyntaxTree.Parser(new Tokens.GapRemover(Tokens.Lexer.create(sourceString, handler)), handler)
		const statements = parser.next().statements
		return statements.next() as SyntaxTree.Declarations.Assignment
	}
}
Unit.Fixture.add(new AssignmentTest())
