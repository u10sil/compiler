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
export class EndOfFileTest extends Unit.Fixture {
	constructor() {
		super("Tokens.EndOfFile")
		const errorHandler = new Error.ConsoleHandler()
		this.add("empty source string", () => {
			const source = new Tokens.Source(IO.StringReader.create(""), errorHandler)
			const token = Tokens.EndOfFile.scan(source)
			this.expect(token instanceof Tokens.EndOfFile)
			this.expect(token!.serialize(), Is.equal.to({ class: "endOfFile" }))
		})
		this.add("null string", () => {
			const source = new Tokens.Source(IO.StringReader.create("\0"), errorHandler)
			const token = Tokens.EndOfFile.scan(source)
			this.expect(token instanceof Tokens.EndOfFile)
			this.expect(token!.serialize(), Is.equal.to({ class: "endOfFile" }))
		})
	}
}
Unit.Fixture.add(new EndOfFileTest())
