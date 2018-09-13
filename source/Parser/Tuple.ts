// Copyright (C) 2017  Simon Mika <simon@mika.se>
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

import * as Type from "./Type"
import { Source } from "./Source"
import * as Expression from "./Expression"
import * as SyntaxTree from "../SyntaxTree"
import { Utilities } from "@cogneco/mend"

export function parseElements(source: Source): SyntaxTree.Expression[] {
	if (!source.fetch()!.isSeparator("("))
		source.raise("Expected start parenthesis.")
	const result: SyntaxTree.Expression[] = []
	if (!source.peek()!.isSeparator(")"))
		do {
			const element = Expression.parse(source)
			if (element)
				result.push(element)
			else
				source.raise("Expected expression in tuple.")
		} while (source.peek()!.isSeparator(",") && source.fetch())
	if (!source.fetch()!.isSeparator(")"))
		source.raise("Expected end parenthesis.")
	return result
}
export function parse(source: Source, precedance: number, previous?: SyntaxTree.Expression): SyntaxTree.Expression | undefined {
	let result: SyntaxTree.Expression | undefined
	if (!previous && source.peek()!.isSeparator("(")) {
		const elements = parseElements(source)
		result = elements.length == 1 ? elements[0] : new SyntaxTree.Tuple(Utilities.Enumerable.from(elements), Type.tryParse(source), source.mark())
		result = Expression.parse(source, precedance, result)
	}
	return result
}
Expression.addParser(parse, 10)
