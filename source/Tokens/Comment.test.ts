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
export class CommentTest extends Unit.Fixture {
	constructor() {
		super("Tokens.Comment")
		var errorHandler = new Error.ConsoleHandler()
		this.add("line comment", () => {
			var source = new Tokens.Source(new IO.StringReader("//this is a line comment"), errorHandler)
			var token = Tokens.Comment.scan(source)
			this.expect(token instanceof Comment)
			this.expect((<Tokens.Comment>token).getContent(), Is.Equal().To("this is a line comment"))
		})
		this.add("block comment, single line", () => {
			var source = new Tokens.Source(new IO.StringReader("/*this is a block comment*/"), errorHandler)
			var token = Tokens.Comment.scan(source)
			this.expect(token instanceof Comment)
			this.expect((<Tokens.Comment>token).getContent(), Is.Equal().To("this is a block comment"))
		})
		this.add("block comment, multiple lines", () => {
			var source = new Tokens.Source(new IO.StringReader("/*this\nis\na\nblock\ncomment*/"), errorHandler)
			var token = Tokens.Comment.scan(source)
			this.expect(token instanceof Comment)
			this.expect((<Tokens.Comment>token).getContent(), Is.Equal().To("this\nis\na\nblock\ncomment"))
		})
	}
}
Unit.Fixture.add(new CommentTest())
