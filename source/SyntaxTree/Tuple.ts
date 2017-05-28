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

import * as Tokens from "../Tokens"
import * as Type from "./Type"
import { Source } from "./Source"
import { Expression } from "./Expression"

export class Tuple extends Expression {
	get precedence() { return Number.MAX_VALUE }
	constructor(readonly elements: Expression[], type: Type.Expression | undefined, tokens: Tokens.Substance[]) {
		super(type, tokens)
	}
	serialize(): { class: string } & any {
		return {
			class: "tuple",
			elements: this.elements.length > 0 ? this.elements.map(e => e.serialize()) : undefined,
		}
	}
	static parseElements(source: Source) {
		if (!source.next()!.isSeparator("("))
			source.raise("Expected start parenthesis.")
		const result: Expression[] = []
		if (!source.peek()!.isSeparator(")"))
			do {
				const element = Expression.parse(source)
				if (element)
					result.push(element)
				else
					source.raise("Expected expression in tuple.")
			} while (source.peek()!.isSeparator(",") && source.next())
		if (!source.next()!.isSeparator(")"))
			source.raise("Expected end parenthesis.")
		return result
	}
	static parse(source: Source, precedance: number, previous?: Expression): Expression | undefined {
		let result: Expression | undefined
		if (!previous && source.peek()!.isSeparator("(")) {
			const elements = Tuple.parseElements(source)
			result = elements.length == 1 ? elements[0] : new Tuple(elements, Type.Expression.tryParse(source), source.mark())
			result = Expression.parse(source, precedance, result)
		}
		return result
	}
}
Expression.addExpressionParser(Tuple.parse, 10)
