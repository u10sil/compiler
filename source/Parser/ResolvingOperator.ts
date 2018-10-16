// Copyright (C) 2018  Simon Mika <simon@mika.se>
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

import * as Tokens from "../Tokens"
import { Source } from "./Source"
import * as Expression from "./Expression"
import * as SyntaxTree from "../SyntaxTree"

export function parse(source: Source, precedance: number, previous?: SyntaxTree.Expression): SyntaxTree.Expression | undefined {
	let result: SyntaxTree.Expression | undefined
	if (previous && (source.peek()!.isOperator(".") || source.peek()!.isOperator(".?")) && precedance < 300) {
		const symbol = (source.fetch() as Tokens.Operator).symbol
		if (!previous)
			source.raise("Missing left hand of infix operator " + symbol)
		else {
			const right = Expression.parse(source, 300)
			if (right instanceof SyntaxTree.Identifier)
				result = Expression.parse(source, precedance, new SyntaxTree.ResolvingOperator(symbol, previous, right, source.mark()))
			else
				source.raise("Right hand of resolving operator must by identifier.")
		}
	}
	return result
}
Expression.addParser(parse)
