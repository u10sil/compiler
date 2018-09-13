// Copyright (C) 2015, 2017  Simon Mika <simon@mika.se>
//
// This file is part of U10sil.
//
// U10sil is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// U10sil is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with U10sil.  If not, see <http://www.gnu.org/licenses/>.
//

import { Error, IO } from "@cogneco/mend"
import * as Tokens from "../"

describe("Tokens.Literals.String", () => {
	const errorHandler = new Error.ConsoleHandler()
	let token: Tokens.Token | undefined
	it("empty", () => {
		const s = "\"\""
		const source = new Tokens.Source(IO.StringReader.create(s), errorHandler)
		expect((token = Tokens.Literals.String.scan(source)) instanceof Tokens.Literals.String).toBeTruthy()
		expect((token as Tokens.Literals.String).value).toEqual("")
		expect(token!.serialize()).toEqual({ class: "string", value: "" })
	})
	it("string with escape sequence #1", () => {
		const s = "\" \\\" \""
		const source = new Tokens.Source(IO.StringReader.create(s), errorHandler)
		expect((token = Tokens.Literals.String.scan(source)) instanceof Tokens.Literals.String).toBeTruthy()
		expect((token as Tokens.Literals.String).value).toEqual(" \" ")
		expect(token!.serialize()).toEqual({ class: "string", value: " \" " })
	})
})
