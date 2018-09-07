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

import { Error } from "@cogneco/mend"
import * as SyntaxTree from "../../SyntaxTree"
import * as Parser from "../"

describe("Parser.Expressions.Literal.Character", () => {
	const handler = new Error.ConsoleHandler()
	it("literal", () => {
		const literal = Parser.parseFirst("'a'", handler)
		expect(literal instanceof SyntaxTree.Literal.Character).toBeTruthy()
		expect((literal as SyntaxTree.Literal.Character).value).toEqual("a")
		expect(SyntaxTree.filterId(literal!.serialize())).toEqual({ class: "literal.character", value: "a" })
	})
})
