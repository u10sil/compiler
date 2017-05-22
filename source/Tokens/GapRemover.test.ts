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
import * as Tokens from "./"

import Is = Unit.Is
export class GapRemoverTest extends Unit.Fixture {
	constructor() {
		super("Tokens.GapRemover")
		var errorHandler = new Error.ConsoleHandler()
		this.add("common expression", () => {
			var testString = "\t\ta := b / c\n"
			var lexer = new Tokens.Lexer(new IO.StringReader(testString), errorHandler)
			var gapRemover = new Tokens.GapRemover(lexer)
			var token: Tokens.Token
			this.expect((token = gapRemover.next()) instanceof Tokens.Identifier);
			this.expect((<Tokens.Identifier>token).name, Is.equal.to("a"))
			this.expect((token = gapRemover.next()) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).symbol, Is.equal.to(":="))
			this.expect((token = gapRemover.next()) instanceof Tokens.Identifier)
			this.expect((<Tokens.Identifier>token).name, Is.equal.to("b"))
			this.expect((token = gapRemover.next()) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).symbol, Is.equal.to("/"))
			this.expect((token = gapRemover.next()) instanceof Tokens.Identifier)
			this.expect((<Tokens.Identifier>token).name, Is.equal.to("c"))
		})
		this.add("verify gaps", () => {
			var testString = "\t\t\ta := b**c\t\n"
			var lexer = new Tokens.Lexer(new IO.StringReader(testString), errorHandler)
			var gapRemover = new Tokens.GapRemover(lexer)
			var token: Tokens.Token
			// PRE-GAP:	"\t\t\t"
			// POST-GAP: " "
			this.expect((token = gapRemover.next()) instanceof Tokens.Identifier)
			this.expect((<Tokens.Identifier>token).name, Is.equal.to("a"))
			this.expect((<Tokens.Identifier>token).pregap[0].region.content, Is.equal.to("\t\t\t"))
			this.expect((<Tokens.Identifier>token).postgap[0].region.content, Is.equal.to(" "))
			// PRE-GAP: <none>
			// POST-GAP: " "
			this.expect((token = gapRemover.next()) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).symbol, Is.equal.to(":="))
			this.expect((<Tokens.Operator>token).pregap.length, Is.equal.to(0))
			this.expect((<Tokens.Operator>token).postgap[0].region.content, Is.equal.to(" "))
			// PRE-GAP: <none>
			// POST-GAP: <none>
			this.expect((token = gapRemover.next()) instanceof Tokens.Identifier)
			this.expect((<Tokens.Identifier>token).name, Is.equal.to("b"))
			this.expect((<Tokens.Identifier>token).pregap.length, Is.equal.to(0))
			this.expect((<Tokens.Identifier>token).postgap.length, Is.equal.to(0))
			// PRE-GAP: <none>
			// POST-GAP: <none>
			this.expect((token = gapRemover.next()) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).symbol, Is.equal.to("**"))
			this.expect((<Tokens.Operator>token).pregap.length, Is.equal.to(0))
			this.expect((<Tokens.Operator>token).postgap.length, Is.equal.to(0))
			// PRE-GAP: <none>
			// POST-GAP: "\t\n"
			this.expect((token = gapRemover.next()) instanceof Tokens.Identifier)
			this.expect((<Tokens.Identifier>token).name, Is.equal.to("c"))
			this.expect((<Tokens.Identifier>token).pregap.length, Is.equal.to(0))
			this.expect((<Tokens.Identifier>token).postgap[0].region.content, Is.equal.to("\t\n"))
		})
	}
}
Unit.Fixture.add(new GapRemoverTest())
