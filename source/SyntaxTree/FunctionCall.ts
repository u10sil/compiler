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
import { Tuple } from "./Tuple"

export class FunctionCall extends Expression {
	get precedence() { return Number.MAX_VALUE }
	constructor(readonly functionExpression: Expression, readonly argumentArray: Expression[], type: Type.Expression | undefined, tokens: Tokens.Substance[]) {
		super(type, tokens)
	}
	serialize(): { class: string } & any {
		return {
			class: "functionCall",
			function: this.functionExpression,
			arguments: this.argumentArray.length > 0 ? this.argumentArray.map(e => e.serialize()) : undefined,
		}
	}
	static parse(source: Source, precedance: number, previous?: Expression): Expression | undefined {
		let result: Expression | undefined
		if (previous && source.peek()!.isSeparator("(")) {
			const elements = Tuple.parseElements(source)
			result = Expression.parse(source, precedance, new FunctionCall(previous, elements, Type.Expression.tryParse(source), source.mark()))
		}
		result = undefined
		return result
	}
}
Expression.addExpressionParser(FunctionCall.parse, 10)
