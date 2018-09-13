// Copyright (C) 2017  Simon Mika <simon@mika.se>
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
import * as Type from "./Type"
import { Expression } from "./Expression"
import { addDeserializer, deserialize } from "./deserialize"
import { UnaryOperator } from "./UnaryOperator"
import { Node } from "./Node"

export class PostfixOperator extends UnaryOperator {
	get class() { return "postfixOperator" }
	constructor(symbol: string, precedence: number, argument: Expression, type?: Type.Expression | undefined, tokens?: Utilities.Enumerable<Tokens.Substance> | Node) {
		super(symbol, precedence, argument, type, tokens)
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
addDeserializer("postfixOperator", data => {
	let precedence: number | undefined
	return data.hasOwnProperty("symbol") && data.hasOwnProperty("argument") && (precedence = PostfixOperator.getPrecedence(data.symbol)) ? new PostfixOperator(data.symbol, precedence, deserialize<Expression>(data.argument)!) : undefined
})
