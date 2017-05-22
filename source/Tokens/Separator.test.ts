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
export class SeparatorTest extends Unit.Fixture {
	constructor() {
		super("Tokens.Separator")
		var errorHandler = new Error.ConsoleHandler()
		this.add("isSeparator()", () => {
			var separator1 = new Tokens.Separator(null, null)
			var separator2 = new Tokens.Separator(":", null)
			this.expect(separator1.isSeparator())
			this.expect(separator1.isSeparator(""), Is.true)
			this.expect(separator1.isSeparator("."), Is.false)
			this.expect(separator2.isSeparator())
			this.expect(separator2.isSeparator("::"), Is.false)
		})
		this.add("scan separators", () => {
			var source = new Tokens.Source(new IO.StringReader(".:;,[](){}"), errorHandler)
			var token: Tokens.Token
			this.expect((token = Tokens.Separator.scan(source)) instanceof Tokens.Separator)
			this.expect((<Tokens.Separator>token).getSymbol(), Is.equal.to("."))
			this.expect((token = Tokens.Separator.scan(source)) instanceof Tokens.Separator)
			this.expect((<Tokens.Separator>token).getSymbol(), Is.equal.to(":"))
			this.expect((token = Tokens.Separator.scan(source)) instanceof Tokens.Separator)
			this.expect((<Tokens.Separator>token).getSymbol(), Is.equal.to(";"))
			this.expect((token = Tokens.Separator.scan(source)) instanceof Tokens.Separator)
			this.expect((<Tokens.Separator>token).getSymbol(), Is.equal.to(","))
			this.expect((token = Tokens.Separator.scan(source)) instanceof Tokens.Separator)
			this.expect((<Tokens.Separator>token).getSymbol(), Is.equal.to("["))
			this.expect((token = Tokens.Separator.scan(source)) instanceof Tokens.Separator)
			this.expect((<Tokens.Separator>token).getSymbol(), Is.equal.to("]"))
			this.expect((token = Tokens.Separator.scan(source)) instanceof Tokens.Separator)
			this.expect((<Tokens.Separator>token).getSymbol(), Is.equal.to("("))
			this.expect((token = Tokens.Separator.scan(source)) instanceof Tokens.Separator)
			this.expect((<Tokens.Separator>token).getSymbol(), Is.equal.to(")"))
			this.expect((token = Tokens.Separator.scan(source)) instanceof Tokens.Separator)
			this.expect((<Tokens.Separator>token).getSymbol(), Is.equal.to("{"))
			this.expect((token = Tokens.Separator.scan(source)) instanceof Tokens.Separator)
			this.expect((<Tokens.Separator>token).getSymbol(), Is.equal.to("}"))
		})
	}
}
Unit.Fixture.add(new SeparatorTest())
