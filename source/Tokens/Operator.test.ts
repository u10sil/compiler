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
export class OperatorTest extends Unit.Fixture {
	constructor() {
		super("Tokens.Operator")
		var errorHandler = new Error.ConsoleHandler()
		this.add("isOperator()", () => {
			var operator1 = new Tokens.Operator(null, null)
			var operator2 = new Tokens.Operator(">", null)
			this.expect(operator1.isOperator())
			this.expect(operator1.isOperator(""), Is.True())
			this.expect(operator1.isOperator("+"), Is.False())
			this.expect(operator2.isOperator())
			this.expect(operator2.isOperator(">"))
			this.expect(operator2.isOperator("+"), Is.False())
		})
		this.add("scan operator", () => {
			var source = new Tokens.Source(new IO.StringReader("<==>"), errorHandler)
			var token = Tokens.Operator.scan(source)
			this.expect(token instanceof Tokens.Operator)
			this.expect(token.isOperator())
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("<==>"))
		})
		this.add("arithmetic", () => {
			var source = new Tokens.Source(new IO.StringReader("+-*/**%++***"), errorHandler)
			var token: Tokens.Token
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("+"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("-"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("*"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("/"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("**"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("%"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("++"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("**"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("*"))
		})
		this.add("binary/bitwise and logical", () => {
			var source = new Tokens.Source(new IO.StringReader("<<>>^&|||&&??"), errorHandler)
			var token: Tokens.Token
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("<<"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To(">>"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("^"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("&"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("||"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("|"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("&&"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("??"))
		})
		this.add("assignment", () => {
			var source = new Tokens.Source(new IO.StringReader("=-=*=/=**=%=<<=>>=^=&=|=:=::="), errorHandler)
			var token: Tokens.Token
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("="))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("-="))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("*="))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("/="))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("**="))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("%="))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("<<="))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To(">>="))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("^="))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("&="))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("|="))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To(":="))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("::="))
		})
		this.add("comparison", () => {
			var source = new Tokens.Source(new IO.StringReader("==<><=:==<==>>=!="), errorHandler)
			var token: Tokens.Token
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("=="))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("<"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To(">"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("<="))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To(":=="))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("<==>"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To(">="))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("!="))
		})
		this.add("unary", () => {
			var source = new Tokens.Source(new IO.StringReader("!@~?"), errorHandler)
			var token: Tokens.Token
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("!"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("@"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("~"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("?"))
		})
		this.add("misfits", () => {
			var source = new Tokens.Source(new IO.StringReader("..->=>..."), errorHandler)
			var token: Tokens.Token
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To(".."))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("->"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("=>"))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((<Tokens.Operator>token).getSymbol(), Is.Equal().To("..."))
		})
	}
}
Unit.Fixture.add(new OperatorTest())
