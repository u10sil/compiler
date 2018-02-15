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

import { Utilities } from "@cogneco/mend"
import * as Tokens from "../Tokens"
import * as Type from "./Type"
import { Expression } from "./Expression"
import { addDeserializer, deserialize } from "./deserialize"

export class FunctionCall extends Expression {
	get class() { return "functionCall" }
	get precedence() { return 200 }
	get argumentList(): Utilities.Iterator<Expression> {
		return new Utilities.ArrayIterator(this.argumentsArray)
	}
	constructor(readonly functionExpression: Expression, private argumentsArray: Expression[], type?: Type.Expression | undefined, tokens?: Utilities.Iterable<Tokens.Substance>) {
		super(type, tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			function: this.functionExpression.serialize(),
			arguments: this.argumentsArray.length > 0 ? this.argumentsArray.map(e => e.serialize()) : undefined,
		}
	}
}
addDeserializer("functionCall", data => data.hasOwnProperty("function") ? new FunctionCall(deserialize<Expression>(data.value)!, deserialize<Expression>(data.arguments as ({ class: string } & any)[])) : undefined)
