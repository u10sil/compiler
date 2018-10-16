// Copyright (C) 2015, 2017, 2018  Simon Mika <simon@mika.se>
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
import * as Expression from "./Expression"
import * as Type from "./Type"
import * as SyntaxTree from "../SyntaxTree"
import * as Declaration from "./Declaration"

export function parse(source: Source): SyntaxTree.PropertyDeclaration | undefined {
	let result: SyntaxTree.PropertyDeclaration | undefined
	const next = source.peek()
	let isConstant = false
	if (!!next && next.isIdentifier("var") || (isConstant = next!.isIdentifier("let"))) {
		source.fetch() // consume "var" or "let"
		const symbol = Declaration.parseIdentifier(source)
		if (!symbol)
			source.raise("Expected symbol in property declaration.")
		const type = Type.tryParse(source.clone())
		let value: SyntaxTree.Expression | undefined
		if (source.peek()!.isOperator("=") && source.fetch())
			value = Expression.parse(source, 90)
		result = new SyntaxTree.PropertyDeclaration(symbol!, isConstant, false, type, value, source.mark())
	}
	return result
}
Statement.addParser("class", parse)
