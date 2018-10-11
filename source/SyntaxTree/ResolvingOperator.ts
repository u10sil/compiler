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

import { Utilities } from "@cogneco/mend"
import * as Tokens from "../Tokens"
import { Expression } from "./Expression"
import { InfixOperator } from "./InfixOperator"
import { Associativity } from "./Associativity"
import { addDeserializer, deserialize } from "./deserialize"
import { Node } from "./Node"

export class ResolvingOperator extends InfixOperator {
	get class() { return "resolvingOperator" }
	constructor(symbol: string, left: Expression, right: Expression, tokens?: Utilities.Enumerable<Tokens.Substance> | Node) {
		super(symbol, 300, Associativity.None, left, right, tokens)
	}
}
addDeserializer("resolvingOperator", data => {
	let result: ResolvingOperator | undefined
	if (data.hasOwnProperty("symbol") && data.hasOwnProperty("left") && data.hasOwnProperty("right"))
		result = new ResolvingOperator(data.symbol, deserialize<Expression>(data.left)!, deserialize<Expression>(data.right)!)
	return result
})
