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

import { Error, Unit } from "@cogneco/mend"
import * as SyntaxTree from "./"

import Is = Unit.Is
export class InfixOperatorTest extends Unit.Fixture {
	constructor() {
		super("SyntaxTree.InfixOperator")
		const handler = new Error.ConsoleHandler()
		this.add("a = 'b'", () => {
			const result = SyntaxTree.Parser.parseFirst("a = 'b'", handler) as SyntaxTree.InfixOperator
			this.expect(result.symbol, Is.equal.to("="))
			this.expect((result.left as SyntaxTree.Identifier).name, Is.equal.to("a"))
			this.expect((result.right as SyntaxTree.Literal.Character).value, Is.equal.to("b"))
			this.expect(result.serialize(), Is.equal.to({
				class: "infixOperator",
				symbol: "=",
				left: { class: "identifier", name: "a" },
				right: { class: "literal.character", value: "b" },
			}))
		})
		this.add("a = 12345", () => {
			const result = SyntaxTree.Parser.parseFirst("a = 12345", handler) as SyntaxTree.InfixOperator
			this.expect(result.symbol, Is.equal.to("="))
			this.expect((result.left as SyntaxTree.Identifier).name, Is.equal.to("a"))
			this.expect((result.right as SyntaxTree.Literal.Number).value, Is.equal.to(12345))
			this.expect(result.serialize(), Is.equal.to({
				class: "infixOperator",
				symbol: "=",
				left: { class: "identifier", name: "a" },
				right: { class: "literal.number", value: 12345 },
			}))
		})
		this.add("a = b", () => {
			const result = SyntaxTree.Parser.parseFirst("a = b", handler) as SyntaxTree.InfixOperator
			this.expect(result.symbol, Is.equal.to("="))
			this.expect((result.left as SyntaxTree.Identifier).name, Is.equal.to("a"))
			this.expect((result.right as SyntaxTree.Identifier).name, Is.equal.to("b"))
			this.expect(result.serialize(), Is.equal.to({
				class: "infixOperator",
				symbol: "=",
				left: { class: "identifier", name: "a" },
				right: { class: "identifier", name: "b" },
			}))
		})
		this.add("a.b", () => {
			const result = SyntaxTree.Parser.parseFirst("a.b", handler) as SyntaxTree.InfixOperator
			this.expect(result.symbol, Is.equal.to("."))
			this.expect((result.left as SyntaxTree.Identifier).name, Is.equal.to("a"))
			this.expect((result.right as SyntaxTree.Identifier).name, Is.equal.to("b"))
			this.expect(result.serialize(), Is.equal.to({
				class: "infixOperator",
				symbol: ".",
				left: { class: "identifier", name: "a" },
				right: { class: "identifier", name: "b" },
			}))
		})
		this.add("a.b * c.d", () => {
			const result = SyntaxTree.Parser.parseFirst("a.b * c.d", handler) as SyntaxTree.InfixOperator
			this.expect(result.serialize(), Is.equal.to({
				class: "infixOperator",
				symbol: "*",
				left: {
					class: "infixOperator",
					symbol: ".",
					left: { class: "identifier", name: "a" },
					right: { class: "identifier", name: "b" },
				},
				right: {
					class: "infixOperator",
					symbol: ".",
					left: { class: "identifier", name: "c" },
					right: { class: "identifier", name: "d" },
				},
			}))
		})
	}
}
Unit.Fixture.add(new InfixOperatorTest())
