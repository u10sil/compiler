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

describe("Tokens.Comment", () => {
	const errorHandler = new Error.ConsoleHandler()
	it("line comment", () => {
		const source = new Tokens.Source(IO.StringReader.create("//this is a line comment"), errorHandler)
		const token = Tokens.Comment.scan(source)
		expect(token instanceof Tokens.Comment).toBeTruthy()
		expect((token as Tokens.Comment).content).toEqual("this is a line comment")
		expect(token!.serialize()).toEqual({ class: "comment", content: "this is a line comment" })
	})
	it("block comment, single line", () => {
		const source = new Tokens.Source(IO.StringReader.create("/*this is a block comment*/"), errorHandler)
		const token = Tokens.Comment.scan(source)
		expect(token instanceof Tokens.Comment).toBeTruthy()
		expect((token as Tokens.Comment).content).toEqual("this is a block comment")
		expect(token!.serialize()).toEqual({ class: "comment", content: "this is a block comment", isBlock: true })
	})
	it("block comment, multiple lines", () => {
		const source = new Tokens.Source(IO.StringReader.create("/*this\nis\na\nblock\ncomment*/"), errorHandler)
		const token = Tokens.Comment.scan(source)
		expect(token instanceof Tokens.Comment).toBeTruthy()
		expect((token as Tokens.Comment).content).toEqual("this\nis\na\nblock\ncomment")
		expect(token!.serialize()).toEqual({ class: "comment", content: "this\nis\na\nblock\ncomment", isBlock: true })
	})
})
