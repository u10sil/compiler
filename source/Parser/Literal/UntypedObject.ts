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

import { Source } from "../Source"
import * as Expression from "../Expression"
import * as SyntaxTree from "../../SyntaxTree"
import * as Tokens from "../../Tokens"
import * as Type from "../Type"

function parse(source: Source, precedance: number, previous?: SyntaxTree.Expression): SyntaxTree.Expression | undefined {
	let result: SyntaxTree.Literal.UntypedObject | undefined
	if (source.peek()!.isSeparator("{") && (source.peek(1)!.isIdentifier() || (source.peek(1) instanceof Tokens.Literals.String) && source.peek(2)!.isOperator(":"))) {
		const data: { [property: string]: SyntaxTree.Expression } = {}
		do {
			source.fetch() // consume: {
			const token = source.fetch()
			const name = token instanceof Tokens.Identifier ? token.name : token instanceof Tokens.Literals.String ? token.value : undefined
			if (!name)
				source.raise("Expected identifier or string literal as property name in object literal.")
			else {
				if (source.fetch()!.isOperator(":"))
					source.raise("Expected \":\" after property name: \"" + name + "\" in object literal.")
				const value = Expression.parse(source)
				if (value)
					data[name] = value
				else
					source.raise("Missing expression after property name: \"" + name + "\" in object literal.")
			}
		} while (source.peek()!.isSeparator(";"))
		if (!source.fetch()!.isSeparator("}"))
			source.raise("Expected \"}\" to end object literal.")
		result = new SyntaxTree.Literal.UntypedObject(data, Type.tryParse(source), source.mark())
		if (previous instanceof SyntaxTree.Identifier)
			result = new SyntaxTree.Literal.TypedObject(previous, result)
	}
	return result
}
Expression.addParser(parse)
