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

describe("Tokens.Separator", () => {
	const errorHandler = new Error.ConsoleHandler()
	it("isSeparator()", () => {
		const separator1 = new Tokens.Separator("")
		const separator2 = new Tokens.Separator(":")
		expect(separator1.isSeparator()).toBeTruthy()
		expect(separator1.isSeparator("")).toBeTruthy()
		expect(separator1.isSeparator(".")).toBeFalsy()
		expect(separator1.serialize()).toEqual({ class: "separator", symbol: "" })
		expect(separator2.isSeparator()).toBeTruthy()
		expect(separator2.isSeparator("::")).toBeFalsy()
		expect(separator2.serialize()).toEqual({ class: "separator", symbol: ":" })
	})
	it("scan separators", () => {
		const source = new Tokens.Source(IO.StringReader.create(".:;,[](){}"), errorHandler)
		let token: Tokens.Token | undefined
		expect((token = Tokens.Separator.scan(source)) instanceof Tokens.Separator).toBeTruthy()
		expect((token as Tokens.Separator).symbol).toEqual(".")
		expect(token!.serialize()).toEqual({ class: "separator", symbol: "." })
		expect((token = Tokens.Separator.scan(source)) instanceof Tokens.Separator).toBeTruthy()
		expect((token as Tokens.Separator).symbol).toEqual(":")
		expect(token!.serialize()).toEqual({ class: "separator", symbol: ":" })
		expect((token = Tokens.Separator.scan(source)) instanceof Tokens.Separator).toBeTruthy()
		expect((token as Tokens.Separator).symbol).toEqual(";")
		expect(token!.serialize()).toEqual({ class: "separator", symbol: ";" })
		expect((token = Tokens.Separator.scan(source)) instanceof Tokens.Separator).toBeTruthy()
		expect((token as Tokens.Separator).symbol).toEqual(",")
		expect(token!.serialize()).toEqual({ class: "separator", symbol: "," })
		expect((token = Tokens.Separator.scan(source)) instanceof Tokens.Separator).toBeTruthy()
		expect((token as Tokens.Separator).symbol).toEqual("[")
		expect(token!.serialize()).toEqual({ class: "separator", symbol: "[" })
		expect((token = Tokens.Separator.scan(source)) instanceof Tokens.Separator).toBeTruthy()
		expect((token as Tokens.Separator).symbol).toEqual("]")
		expect(token!.serialize()).toEqual({ class: "separator", symbol: "]" })
		expect((token = Tokens.Separator.scan(source)) instanceof Tokens.Separator).toBeTruthy()
		expect((token as Tokens.Separator).symbol).toEqual("(")
		expect(token!.serialize()).toEqual({ class: "separator", symbol: "(" })
		expect((token = Tokens.Separator.scan(source)) instanceof Tokens.Separator).toBeTruthy()
		expect((token as Tokens.Separator).symbol).toEqual(")")
		expect(token!.serialize()).toEqual({ class: "separator", symbol: ")" })
		expect((token = Tokens.Separator.scan(source)) instanceof Tokens.Separator).toBeTruthy()
		expect((token as Tokens.Separator).symbol).toEqual("{")
		expect(token!.serialize()).toEqual({ class: "separator", symbol: "{" })
		expect((token = Tokens.Separator.scan(source)) instanceof Tokens.Separator).toBeTruthy()
		expect((token as Tokens.Separator).symbol).toEqual("}")
		expect(token!.serialize()).toEqual({ class: "separator", symbol: "}" })
	})
})
