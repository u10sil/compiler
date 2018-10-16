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
import * as Tokens from "../../Tokens"
import { Expression } from "./Expression"
import { Operator } from "./Operator"

export class InfixOperator extends Operator {
	get class() { return "InfixOperator" }
	constructor(
		readonly symbol: string,
		readonly precedence: number,
		readonly associativity: "left" | "right" | "none",
		readonly left: Expression,
		readonly right: Expression,
		tokens?: Utilities.Enumerable<Tokens.Substance>) {
		super(tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			symbol: this.symbol,
			precedence: this.precedence,
			associativity: this.associativity,
			left: this.left.serialize(),
			right: this.right.serialize(),
		}
	}
}
