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
		var errorHandler = new Error.ConsoleHandler()
		var token: Tokens.Token
		this.add("empty", () => {
			var s = "\"\""
			var source = new Tokens.Source(new IO.StringReader(s), errorHandler)
			this.expect((token = Tokens.Literals.String.scan(source)) instanceof String, Is.True())
			this.expect((<Tokens.Literals.String>token).getValue(), Is.Equal().To(""))
		})
		this.add("string with escape sequence #1", () => {
			var s = "\" \\\" \""
			var source = new Tokens.Source(new IO.StringReader(s), errorHandler)
			this.expect((token = Tokens.Literals.String.scan(source)) instanceof String, Is.True())
			this.expect((<Tokens.Literals.String>token).getValue(), Is.Equal().To(" \" "))
		})
	}
}
Unit.Fixture.add(new StringTest())
