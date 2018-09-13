// Copyright (C) 2015, 2017  Simon Mika <simon@mika.se>
//
// This file is part of U10sil.
//
// U10sil is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// U10sil is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with U10sil.  If not, see <http://www.gnu.org/licenses/>.
//

import { Error } from "@cogneco/mend"
import * as Tokens from "./"

describe("Tokens.GapRemover", () => {
	const errorHandler = new Error.ConsoleHandler()
	it("common expression", () => {
		const testString = "\t\ta := b / c\n"
		const lexer = Tokens.Lexer.create(testString, errorHandler)
		const gapRemover = new Tokens.GapRemover(lexer)
		let token: Tokens.Substance | undefined
		expect((token = gapRemover.fetch()) instanceof Tokens.Identifier).toBeTruthy()
		expect((token as Tokens.Identifier).name).toEqual("a")
		expect((token = gapRemover.fetch()) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual(":=")
		expect((token = gapRemover.fetch()) instanceof Tokens.Identifier).toBeTruthy()
		expect((token as Tokens.Identifier).name).toEqual("b")
		expect((token = gapRemover.fetch()) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("/")
		expect((token = gapRemover.fetch()) instanceof Tokens.Identifier).toBeTruthy()
		expect((token as Tokens.Identifier).name).toEqual("c")
	})
	it("verify gaps", () => {
		const testString = "\t\t\ta := b**c\t\n"
		const lexer = Tokens.Lexer.create(testString, errorHandler)
		const gapRemover = new Tokens.GapRemover(lexer)
		let token: Tokens.Substance | undefined
		// PRE-GAP:	"\t\t\t"
		// POST-GAP: " "
		expect((token = gapRemover.fetch()) instanceof Tokens.Identifier).toBeTruthy()
		expect((token as Tokens.Identifier).name).toEqual("a")
		expect((token as Tokens.Identifier).pregap[0].region!.content).toEqual("\t\t\t")
		expect((token as Tokens.Identifier).postgap[0].region!.content).toEqual(" ")
		// PRE-GAP: <none>
		// POST-GAP: " "
		expect((token = gapRemover.fetch()) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual(":=")
		expect((token as Tokens.Operator).pregap.length).toEqual(0)
		expect((token as Tokens.Operator).postgap[0].region!.content).toEqual(" ")
		// PRE-GAP: <none>
		// POST-GAP: <none>
		expect((token = gapRemover.fetch()) instanceof Tokens.Identifier).toBeTruthy()
		expect((token as Tokens.Identifier).name).toEqual("b")
		expect((token as Tokens.Identifier).pregap.length).toEqual(0)
		expect((token as Tokens.Identifier).postgap.length).toEqual(0)
		// PRE-GAP: <none>
		// POST-GAP: <none>
		expect((token = gapRemover.fetch()) instanceof Tokens.Operator).toBeTruthy()
		expect((token as Tokens.Operator).symbol).toEqual("**")
		expect((token as Tokens.Operator).pregap.length).toEqual(0)
		expect((token as Tokens.Operator).postgap.length).toEqual(0)
		// PRE-GAP: <none>
		// POST-GAP: "\t\n"
		expect((token = gapRemover.fetch()) instanceof Tokens.Identifier).toBeTruthy()
		expect((token as Tokens.Identifier).name).toEqual("c")
		expect((token as Tokens.Identifier).pregap.length).toEqual(0)
		expect((token as Tokens.Identifier).postgap[0].region!.content).toEqual("\t\n")
	})
})
