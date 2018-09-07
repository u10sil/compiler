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

import { Error, IO } from "@cogneco/mend"
import * as Tokens from "./"

describe("Tokens.Identifier", () => {
	const errorHandler = new Error.ConsoleHandler()
	it("isIdentifier()", () => {
		const identifier1 = new Tokens.Identifier("", null)
		const identifier2 = new Tokens.Identifier("bar", null)
		expect(identifier1.isIdentifier()).toBeTruthy()
		expect(identifier1.isIdentifier("")).toBeTruthy()
		expect(identifier1.isIdentifier("foo")).toBeFalsy()
		expect(identifier1.serialize()).toEqual({ class: "identifier", name: "" })
		expect(identifier2.isIdentifier()).toBeTruthy()
		expect(identifier2.isIdentifier("foo")).toBeFalsy()
		expect(identifier2.serialize()).toEqual({ class: "identifier", name: "bar" })
	})
	it("scan identifier", () => {
		const source = new Tokens.Source(IO.StringReader.create("identifier"), errorHandler)
		const token = Tokens.Identifier.scan(source)
		expect(token instanceof Tokens.Identifier).toBeTruthy()
		expect(token.isIdentifier()).toBeTruthy()
		expect((token as Tokens.Identifier).name).toEqual("identifier")
		expect(token.serialize()).toEqual({ class: "identifier", name: "identifier" })
	})
})
