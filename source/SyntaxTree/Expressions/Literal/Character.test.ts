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
export class CharacterTest extends Unit.Fixture {
	constructor() {
		super("SyntaxTree.Expressions.Literal.Character")
		const handler = new Error.ConsoleHandler()
		this.add("literal", () => {
			const parser = new SyntaxTree.Parser(new Tokens.GapRemover(Tokens.Lexer.create("'a'", handler)), handler)
			const statements = parser.next().statements
			const literal = statements.next()
			this.expect(literal instanceof SyntaxTree.Expressions.Literal.Character, Is.true)
			this.expect((literal as SyntaxTree.Expressions.Literal.Character).value, Is.equal.to("a"))
		})
	}
}
Unit.Fixture.add(new CharacterTest())
