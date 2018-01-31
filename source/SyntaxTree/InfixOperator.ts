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

import { Utilities } from "@cogneco/mend"
import * as Tokens from "../Tokens"
import { Expression } from "./Expression"
import { Operator } from "./Operator"
import { Associativity } from "./Associativity"
import { addDeserializer, deserialize } from "./deserialize"

export class InfixOperator extends Operator {
	get class() { return "infixOperator" }
	constructor(symbol: string, precedence: number, readonly associativity: Associativity, readonly left: Expression, readonly right: Expression, tokens?: () => Utilities.Iterator<Tokens.Substance>) {
		super(symbol, precedence, undefined, tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			symbol: this.symbol,
			left: this.left.serialize(),
			right: this.right.serialize(),
		}
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
addDeserializer("infixOperator", data => {
	let result: InfixOperator | undefined
	if (data.hasOwnProperty("symbol") && data.hasOwnProperty("left") && data.hasOwnProperty("right")) {
		const properties = InfixOperator.getProperties(data.symbol)
		if (properties)
			result = new InfixOperator(data.symbol, properties[0], properties[1], deserialize<Expression>(data.left)!, deserialize<Expression>(data.right)!)
	}
	return result
})
