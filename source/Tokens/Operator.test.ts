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
		const errorHandler = new Error.ConsoleHandler()
		this.add("isOperator()", () => {
			const operator1 = new Tokens.Operator("")
			const operator2 = new Tokens.Operator(">")
			this.expect(operator1.isOperator())
			this.expect(operator1.isOperator(""), Is.true)
			this.expect(operator1.isOperator("+"), Is.false)
			this.expect(operator2.isOperator())
			this.expect(operator2.isOperator(">"))
			this.expect(operator2.isOperator("+"), Is.false)
		})
		this.add("scan operator", () => {
			const source = new Tokens.Source(IO.StringReader.create("<==>"), errorHandler)
			const token = Tokens.Operator.scan(source)!
			this.expect(token instanceof Tokens.Operator)
			this.expect(token.isOperator())
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("<==>"))
			this.expect(token.serialize(), Is.equal.to({ class: "operator", symbol: "<==>" }))
		})
		this.add("arithmetic", () => {
			const source = new Tokens.Source(IO.StringReader.create("+-*/**%++***"), errorHandler)
			let token: Tokens.Token | undefined
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("+"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "+" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("-"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "-" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("*"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "*" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("/"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "/" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("**"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "**" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("%"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "%" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("++"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "++" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("**"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "**" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("*"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "*" }))
		})
		this.add("binary/bitwise and logical", () => {
			const source = new Tokens.Source(IO.StringReader.create("<<>>^&|||&&??"), errorHandler)
			let token: Tokens.Token | undefined
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("<<"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "<<" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to(">>"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: ">>" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("^"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "^" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("&"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "&" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("||"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "||" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("|"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "|" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("&&"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "&&" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("??"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "??" }))
		})
		this.add("assignment", () => {
			const source = new Tokens.Source(IO.StringReader.create("=-=*=/=**=%=<<=>>=^=&=|=:=::="), errorHandler)
			let token: Tokens.Token | undefined
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("="))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "=" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("-="))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "-=" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("*="))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "*=" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("/="))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "/=" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("**="))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "**=" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("%="))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "%=" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("<<="))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "<<=" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to(">>="))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: ">>=" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("^="))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "^=" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("&="))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "&=" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("|="))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "|=" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to(":="))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: ":=" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("::="))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "::=" }))
		})
		this.add("comparison", () => {
			const source = new Tokens.Source(IO.StringReader.create("==<><=:==<==>>=!="), errorHandler)
			let token: Tokens.Token | undefined
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("=="))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "==" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("<"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "<" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to(">"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: ">" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("<="))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "<=" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to(":=="))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: ":==" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("<==>"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "<==>" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to(">="))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: ">=" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("!="))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "!=" }))
		})
		this.add("unary", () => {
			const source = new Tokens.Source(IO.StringReader.create("!@~?"), errorHandler)
			let token: Tokens.Token | undefined
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("!"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "!" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("@"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "@" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("~"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "~" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("?"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "?" }))
		})
		this.add("misfits", () => {
			const source = new Tokens.Source(IO.StringReader.create("..->=>..."), errorHandler)
			let token: Tokens.Token | undefined
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to(".."))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: ".." }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("->"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "->" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("=>"))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "=>" }))
			this.expect((token = Tokens.Operator.scan(source)) instanceof Tokens.Operator)
			this.expect((token as Tokens.Operator).symbol, Is.equal.to("..."))
			this.expect(token!.serialize(), Is.equal.to({ class: "operator", symbol: "..." }))
		})
	}
}
Unit.Fixture.add(new OperatorTest())
