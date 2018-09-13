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
import * as Expression from "./Expression"
import * as Type from "./Type"
import * as SyntaxTree from "../SyntaxTree"
import * as Declaration from "./Declaration"

export function parse(source: Source): SyntaxTree.VariableDeclaration | undefined {
	let result: SyntaxTree.VariableDeclaration | undefined
	const isStatic = source.peek()!.isIdentifier("static")
	const next = source.peek(isStatic ? 1 : 0)
	let isConstant = false
	if (!!next && next.isIdentifier("var") || (isConstant = next!.isIdentifier("let"))) {
		if (isStatic)
			source.fetch() // consume "static"
		source.fetch() // consume "var" or "let"
		const symbol = Declaration.parseIdentifier(source)
		if (!symbol)
			source.raise("Expected symbol in variable declaration.")
		const type = Type.tryParse(source.clone())
		let value: SyntaxTree.Expression | undefined
		if (source.peek()!.isOperator("=") && source.fetch())
			value = Expression.parse(source, 90)
		result = new SyntaxTree.VariableDeclaration(symbol!, isConstant, isStatic, type, value, source.mark())
	}
	return result
}
Statement.addParser(parse)
