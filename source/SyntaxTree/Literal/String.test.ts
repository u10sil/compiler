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
import * as SyntaxTree from "../"

import Is = Unit.Is
export class StringTest extends Unit.Fixture {
	constructor() {
		super("SyntaxTree.Expressions.Literals.StringLiteral")
		const handler = new Error.ConsoleHandler()
		this.add("literal", () => {
			const literal = SyntaxTree.Parser.parseFirst("\"\\\"string\\\"\"", handler)
			this.expect(literal instanceof SyntaxTree.Literal.String, Is.true)
			this.expect((literal as SyntaxTree.Literal.String).value, Is.equal.to("\"string\""))
		})
	}
}
Unit.Fixture.add(new StringTest())
