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

import * as Tokens from "../../Tokens"
import * as Type from "../Type"
import { Source } from "../Source"
import * as Expression from "../Expression"
import * as SyntaxTree from "../../SyntaxTree"

function parse(source: Source, precedance: number, previous?: SyntaxTree.Expression): SyntaxTree.Expression | undefined {
	let result: SyntaxTree.Expression | undefined
	if ((!previous || previous instanceof SyntaxTree.Identifier) && source.peek() instanceof Tokens.Literals.Number) {
		result = new SyntaxTree.Literal.Number((source.fetch() as Tokens.Literals.Number).value, Type.tryParse(source), source.mark())
		result = Expression.parse(source, result.precedence, result)
		if (previous instanceof SyntaxTree.Identifier && result)
			result = new SyntaxTree.Literal.TypedObject(previous.asTypeIdentifier(), result)
	}
	return result
}
Expression.addParser(parse)
