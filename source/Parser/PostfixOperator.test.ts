// Copyright (C) 2017  Simon Mika <simon@mika.se>
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
import * as Parser from "./"

import Is = Unit.Is
export class PostfixOperatorTest extends Unit.Fixture {
	constructor() {
		super("Parser.PostfixOperator")
		const handler = new Error.ConsoleHandler()
		this.add("a--", () => {
			const result = Parser.parseFirst("a--", handler)
			this.expect(result, Is.not.undefined)
			this.expect(result!.serialize(), Is.equal.to({
				class: "postfixOperator",
				symbol: "--",
				argument: { class: "identifier", name: "a" },
			}))
		})
		this.add("a++", () => {
			const result = Parser.parseFirst("a++", handler)
			this.expect(result, Is.not.undefined)
			this.expect(result!.serialize(), Is.equal.to({
				class: "postfixOperator",
				symbol: "++",
				argument: { class: "identifier", name: "a" },
			}))
		})
		this.add("a + a--", () => {
			const result = Parser.parseFirst("a + a--", handler)
			this.expect(result, Is.not.undefined)
			this.expect(result!.serialize(), Is.equal.to({
				class: "infixOperator",
				symbol: "+",
				left: { class: "identifier", name: "a" },
				right: {
					class: "postfixOperator",
					symbol: "--",
					argument: { class: "identifier", name: "a" },
				},
			}))
		})
		this.add("a-- + a", () => {
			const result = Parser.parseFirst("a-- + a", handler)
			this.expect(result, Is.not.undefined)
			this.expect(result!.serialize(), Is.equal.to({
				class: "infixOperator",
				symbol: "+",
				left: {
					class: "postfixOperator",
					symbol: "--",
					argument: { class: "identifier", name: "a" },
				},
				right: { class: "identifier", name: "a" },
			}))
		})
	}
}
Unit.Fixture.add(new PostfixOperatorTest())
