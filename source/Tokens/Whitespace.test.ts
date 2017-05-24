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
export class WhitespaceTest extends Unit.Fixture {
	constructor() {
		super("Tokens.Whitespace")
		const errorHandler = new Error.ConsoleHandler()
		this.add("whitespace", () => {
			const sourceNewline = new Tokens.Source(IO.StringReader.create("\n"), errorHandler)
			const sourceCarriageReturn = new Tokens.Source(IO.StringReader.create("\r"), errorHandler)
			const sourceTab = new Tokens.Source(IO.StringReader.create("\t"), errorHandler)
			const sourceSpace = new Tokens.Source(IO.StringReader.create(" "), errorHandler)
			let token: Tokens.Token
			this.expect((token = Tokens.Whitespace.scan(sourceNewline)) instanceof Tokens.Whitespace)
			this.expect((token as Tokens.Whitespace).endsLine, Is.true)
			this.expect((token = Tokens.Whitespace.scan(sourceCarriageReturn)) instanceof Tokens.Whitespace)
			this.expect((token as Tokens.Whitespace).endsLine, Is.false)
			this.expect((token = Tokens.Whitespace.scan(sourceTab)) instanceof Tokens.Whitespace)
			this.expect((token as Tokens.Whitespace).endsLine, Is.false)
			this.expect((token = Tokens.Whitespace.scan(sourceSpace)) instanceof Tokens.Whitespace)
			this.expect((token as Tokens.Whitespace).endsLine, Is.false)
		})
	}
}
Unit.Fixture.add(new WhitespaceTest())
