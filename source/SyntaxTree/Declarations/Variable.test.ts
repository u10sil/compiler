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
export class VariableTest extends Unit.Fixture {
	constructor() {
		super("SyntaxTree.Declarations.Variable")
		var handler = new Error.ConsoleHandler()
		this.add("simple declaration", () => {
			var variableDeclaration = this.createDeclaration("i: Int\n", handler)
			this.expect(variableDeclaration.symbol, Is.equal.to("i"))
			this.expect((<SyntaxTree.Type.Identifier>variableDeclaration.type).name, Is.equal.to("Int"))
		})
		this.add("static variable", () => {
			var variableDeclaration = this.createDeclaration("i: static Int\n", handler)
			this.expect(variableDeclaration.symbol, Is.equal.to("i"))
			this.expect(variableDeclaration.isStatic, Is.true)
			this.expect((<SyntaxTree.Type.Identifier>variableDeclaration.type).name, Is.equal.to("Int"))
		})
		this.add("constant", () => {
			var variableDeclaration = this.createDeclaration("i: const Int\n", handler)
			this.expect(variableDeclaration.symbol, Is.equal.to("i"))
			this.expect(variableDeclaration.isConstant, Is.true)
			this.expect((<SyntaxTree.Type.Identifier>variableDeclaration.type).name, Is.equal.to("Int"))
		})
		this.add("static const", () => {
			var variableDeclaration = this.createDeclaration("i: static const Int\n", handler)
			this.expect(variableDeclaration.symbol, Is.equal.to("i"))
			this.expect(variableDeclaration.isStatic, Is.true)
			this.expect(variableDeclaration.isConstant, Is.true)
			this.expect((<SyntaxTree.Type.Identifier>variableDeclaration.type).name, Is.equal.to("Int"))
		})
	}
	createDeclaration(sourceString: string, errorHandler: Error.Handler): SyntaxTree.Declarations.Variable {
		var parser = new SyntaxTree.Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader(sourceString), errorHandler)), errorHandler)
		var statements = parser.next().getStatements()
		return <SyntaxTree.Declarations.Variable> statements.next()
	}
}
Unit.Fixture.add(new VariableTest())
