// Copyright (C) 2015, 2016, 2017  Simon Mika <simon@mika.se>
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

import { Utilities } from "@cogneco/mend"
import * as Tokens from "../Tokens"
import { Expression } from "./Expression"
import { Operator } from "./Operator"
import { Associativity } from "./Associativity"
import { addDeserializer, deserialize } from "./deserialize"
import { Node } from "./Node"

export class InfixOperator extends Operator {
	get class() { return "infixOperator" }
	constructor(symbol: string, precedence: number, readonly associativity: Associativity, readonly left: Expression, readonly right: Expression, tokens?: Utilities.Enumerable<Tokens.Substance> | Node) {
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
			// case ".":
			// case ".?":
				// result = [300, Associativity.None]
				// break
		// Bitwise Shifting
			case "<<":
			case ">>":
				result = [160, "none"]
				break
		// Multiplicative
			case "*":
			case "/":
			case "%":
			case "&*":
			case "&":
				result = [150, "left"]
				break
		// Additive
			case "+":
			case "-":
			case "&+":
			case "&-":
			case "|":
			case "^":
				result = [140, "left"]
				break
		// Range Formation
			case "..<":
			case "...":
				result = [135, "none"]
				break
		// Casting TODO: Letters in operator? Does currently not work!
			case "is":
			case "as":
			case "as?":
			case "as!":
				result = [132, "left"]
				break
		// Null coalescing
			case "??":
				/// TODO: Correct precedence for ?? operator?
				result = [132 , "right"]
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
				result = [130, "none"]
				break
		// Conjuctive
			case "&&":
				result = [120, "left"]
				break
		// Disjunctive
			case "||":
				result = [110, "left"]
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
				result = [90, "right"]
		}
		return result
	}
	static create(symbol: string, left: Expression, right: Expression): InfixOperator | undefined {
		let result: InfixOperator | undefined
		const properties = InfixOperator.getProperties(symbol)
		if (properties)
			result = new InfixOperator(symbol, properties[0], properties[1], left, right)
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
