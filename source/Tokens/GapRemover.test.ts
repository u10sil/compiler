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
import * as Tokens from "./"

import Is = Unit.Is
export class GapRemoverTest extends Unit.Fixture {
	constructor() {
		super("Tokens.GapRemover")
		const errorHandler = new Error.ConsoleHandler()
		this.add("common expression", () => {
			const testString = "\t\ta := b / c\n"
			const lexer = Tokens.Lexer.create(testString, errorHandler)
			const gapRemover = new Tokens.GapRemover(lexer)
			let token: Tokens.Substance | undefined
			this.expect((token = gapRemover.fetch()) instanceof Tokens.Identifier)
			this.expect((token as Tokens.Identifier).name, Is.equal.to("a"))
			this.expect((token = gapRemover.fetch()) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to(":="))
			this.expect((token = gapRemover.fetch()) instanceof Tokens.Identifier)
			this.expect((token as Tokens.Identifier).name, Is.equal.to("b"))
			this.expect((token = gapRemover.fetch()) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("/"))
			this.expect((token = gapRemover.fetch()) instanceof Tokens.Identifier)
			this.expect((token as Tokens.Identifier).name, Is.equal.to("c"))
		})
		this.add("verify gaps", () => {
			const testString = "\t\t\ta := b**c\t\n"
			const lexer = Tokens.Lexer.create(testString, errorHandler)
			const gapRemover = new Tokens.GapRemover(lexer)
			let token: Tokens.Substance | undefined
			// PRE-GAP:	"\t\t\t"
			// POST-GAP: " "
			this.expect((token = gapRemover.fetch()) instanceof Tokens.Identifier)
			this.expect((token as Tokens.Identifier).name, Is.equal.to("a"))
			this.expect((token as Tokens.Identifier).pregap[0].region!.content, Is.equal.to("\t\t\t"))
			this.expect((token as Tokens.Identifier).postgap[0].region!.content, Is.equal.to(" "))			// PRE-GAP: <none>
			// POST-GAP: " "
			this.expect((token = gapRemover.fetch()) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to(":="))
			this.expect((token as Tokens.Operator).pregap.length, Is.equal.to(0))
			this.expect((token as Tokens.Operator).postgap[0].region!.content, Is.equal.to(" "))
			// PRE-GAP: <none>
			// POST-GAP: <none>
			this.expect((token = gapRemover.fetch()) instanceof Tokens.Identifier)
			this.expect((token as Tokens.Identifier).name, Is.equal.to("b"))
			this.expect((token as Tokens.Identifier).pregap.length, Is.equal.to(0))
			this.expect((token as Tokens.Identifier).postgap.length, Is.equal.to(0))
			// PRE-GAP: <none>
			// POST-GAP: <none>
			this.expect((token = gapRemover.fetch()) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("**"))
			this.expect((token as Tokens.Operator).pregap.length, Is.equal.to(0))
			this.expect((token as Tokens.Operator).postgap.length, Is.equal.to(0))
			// PRE-GAP: <none>
			// POST-GAP: "\t\n"
			this.expect((token = gapRemover.fetch()) instanceof Tokens.Identifier)
			this.expect((token as Tokens.Identifier).name, Is.equal.to("c"))
			this.expect((token as Tokens.Identifier).pregap.length, Is.equal.to(0))
			this.expect((token as Tokens.Identifier).postgap[0].region!.content, Is.equal.to("\t\n"))
		})
	}
}
Unit.Fixture.add(new GapRemoverTest())
