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
import * as Tokens from "../"

import Is = Unit.Is
export class StringTest extends Unit.Fixture {
	constructor() {
		super("Tokens.Literals.String")
		const errorHandler = new Error.ConsoleHandler()
		let token: Tokens.Token | undefined
		this.add("empty", () => {
			const s = "\"\""
			const source = new Tokens.Source(IO.StringReader.create(s), errorHandler)
			this.expect((token = Tokens.Literals.String.scan(source)) instanceof Tokens.Literals.String, Is.true)
			this.expect((token as Tokens.Literals.String).value, Is.equal.to(""))
		})
		this.add("string with escape sequence #1", () => {
			const s = "\" \\\" \""
			const source = new Tokens.Source(IO.StringReader.create(s), errorHandler)
			this.expect((token = Tokens.Literals.String.scan(source)) instanceof Tokens.Literals.String, Is.true)
			this.expect((token as Tokens.Literals.String).value, Is.equal.to(" \" "))
		})
	}
}
Unit.Fixture.add(new StringTest())
