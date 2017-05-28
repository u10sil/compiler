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

export class PostfixOperator extends Expression {
	constructor(readonly symbol: string, readonly precedence: number, readonly argument: Expression, type: Type.Expression | undefined, tokens: Tokens.Substance[]) {
		super(type, tokens)
	}
	serialize(): { class: string } & any {
		return {
			class: "postfixOperator",
			symbol: this.symbol,
			argument: this.argument.serialize(),
		}
	}
	static parse(source: Source, precedence: number, previous?: Expression): Expression | undefined {
		let result: Expression | undefined
		let operatorPrecedence: number | undefined
		if (previous && source.peek()!.isOperator(o => (operatorPrecedence = PostfixOperator.getPrecedence(o)) != undefined) && precedence < operatorPrecedence!)
			result = Expression.parse(source, precedence, new PostfixOperator((source.next() as Tokens.Operator).symbol, operatorPrecedence!, previous, Type.Expression.tryParse(source), source.mark()))
		return result
	}
	static getPrecedence(symbol: string): number | undefined {
		let result: number | undefined
		switch (symbol) {
			default:
				break
			case "++":
			case "--":
				result = 250
				break
		}
		return result
	}
}
Expression.addExpressionParser(PostfixOperator.parse, 10)
