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

import { Source } from "./Source"
import * as Statement from "./Statement"
import * as Declaration from "./Declaration"
import * as Type from "./Type"
import * as SyntaxTree from "../SyntaxTree"
import { Utilities } from "@cogneco/mend"

function parseContent(source: Source): Utilities.Enumerable<SyntaxTree.Statement> {
	const result: SyntaxTree.Statement[] = []
	if (source.peek()!.isSeparator("{") && !source.peek(2)!.isSeparator(":")) {
		source.fetch() // consume: {
		let next: SyntaxTree.Statement | undefined
		while (source.peek() &&	!source.peek()!.isSeparator("}") && (next = Statement.parse("class", source.clone())))
			result.push(next)
		if (!source.fetch()!.isSeparator("}"))
			source.raise("Expected \"}\"")
	}
	return Utilities.Enumerable.from(result)
}
export function parse(source: Source): SyntaxTree.Statement | undefined {
	let result: SyntaxTree.Statement | undefined
	const isAbstract = source.peek()!.isIdentifier("abstract")
	if (source.peek(isAbstract ? 1 : 0)!.isIdentifier("class") && source.fetch() && (!isAbstract || source.fetch())) {
		const symbol = Type.Name.parse(source.clone())
		if (!symbol)
			source.raise("Expected symbol in class declaration.")
		const parameters = Declaration.parseParameters(source.clone())
		let extended: SyntaxTree.Type.Identifier | undefined
		if (source.peek()!.isIdentifier("extends")) {
			source.fetch() // consume "extends"
			if (!source.peek()!.isIdentifier())
				source.raise("Expected identifier with name of class to extend.")
			extended = Type.Identifier.parse(source.clone())
		}
		const implemented: SyntaxTree.Type.Identifier[] = []
		if (source.peek()!.isIdentifier("implements"))
			do {
				source.fetch() // consume "implements" or ","
				if (!source.peek()!.isIdentifier())
					source.raise("Expected identifier with name of interface to extend.")
				implemented.push(Type.Identifier.parse(source.clone())!)
			} while (source.peek()!.isSeparator(","))
		const content = parseContent(source.clone())
		if (!content)
			source.raise("Expected content in class declaration.")
		if (symbol)
			result = new SyntaxTree.ClassDeclaration(symbol, isAbstract, Utilities.Enumerable.from(parameters), extended, Utilities.Enumerable.from(implemented), content!, source.mark())
	}
	return result
}
Statement.addParser("default", parse)
