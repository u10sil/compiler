// Copyright (C) 2015, 2016, 2017  Simon Mika <simon@mika.se>
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
import { Source } from "./Source"
import { Expression } from "./Expression"
import { Associativity } from "./Associativity"

export class InfixOperator extends Expression {
	constructor(readonly symbol: string, readonly precedence: number, readonly associativity: Associativity, readonly left: Expression, readonly right: Expression, tokens: Tokens.Substance[]) {
		super(undefined, tokens)
	}
	serialize(): { class: string } & any {
		return {
			class: "infixOperator",
			symbol: this.symbol,
			left: this.left.serialize(),
			right: this.right.serialize(),
		}
	}
	static parse(source: Source, precedance: number, previous?: Expression): Expression | undefined {
		let result: Expression | undefined
		let properties: [number, Associativity] | undefined
		if (previous && source.peek()!.isOperator(o => (properties = InfixOperator.getProperties(o)) != undefined) && precedance < properties![0]) {
			const symbol = (source.next() as Tokens.Operator).symbol
			if (!previous)
				source.raise("Missing left hand of infix operator " + symbol)
			const right = Expression.parse(source, properties![0])
			if (!right)
				source.raise("Missing right hand of infix operator " + symbol)
			result = Expression.parse(source, precedance, new InfixOperator(symbol, properties![0], properties![1], previous!, right!, source.mark()))
		}
		return result
	}
	static getProperties(symbol: string): [number, Associativity] | undefined {
		let result: [number, Associativity] | undefined
		switch (symbol) {
			default:
				break
		// Resolving
			case ".":
			case ".?":
				result = [300, Associativity.None]
				break
		// Bitwise Shifting
			case "<<":
			case ">>":
				result = [160, Associativity.None]
				break
		// Multiplicative
			case "*":
			case "/":
			case "%":
			case "&*":
			case "&":
				result = [150, Associativity.Left]
				break
		// Additive
			case "+":
			case "-":
			case "&+":
			case "&-":
			case "|":
			case "^":
				result = [140, Associativity.Left]
				break
		// Range Formation
			case "..<":
			case "...":
				result = [135, Associativity.None]
				break
		// Casting TODO: Letters in operator? Does currently not work!
			case "is":
			case "as":
			case "as?":
			case "as!":
				result = [132, Associativity.Left]
				break
		// Null coalescing
			case "??":
				/// TODO: Correct precedence for ?? operator?
				result = [132 , Associativity.Right]
				break
		// Comparative
			case "<":
			case "<=":
			case ">":
			case ">=":
			case "==":
			case "!=":
			case "===":
			case "!==":
			case "~=":
				result = [130, Associativity.None]
				break
		// Conjuctive
			case "&&":
				result = [120, Associativity.Left]
				break
		// Disjunctive
			case "||":
				result = [110, Associativity.Left]
				break
		// Assigning
			case "=":
			case "*=":
			case "/=":
			case "+=":
			case "-=":
			case "<<=":
			case ">>=":
			case "&=":
			case "^=":
			case "|=":
			case "&&=":
			case "||=":
				result = [90, Associativity.Right]
		}
		return result
	}
}
Expression.addExpressionParser(InfixOperator.parse)
