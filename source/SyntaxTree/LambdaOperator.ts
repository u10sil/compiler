// Copyright (C) 2015, 2017  Simon Mika <simon@mika.se>
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
import { ArgumentDeclaration } from "./ArgumentDeclaration"
import { Expression } from "./Expression"
import { addDeserializer, deserialize } from "./deserialize"
import { Node } from "./Node"
import { Operator } from "./Operator"

export class LambdaOperator extends Operator {
	get class() { return "lambdaOperator" }
	readonly arguments: Utilities.Enumerable<ArgumentDeclaration>
	constructor(
		argumentsEnumerable: Utilities.Enumerable<ArgumentDeclaration>,
		readonly returnType: Type.Expression | undefined, readonly body: Expression, tokens?: Utilities.Enumerable<Tokens.Substance> | Node) {
		super("=>", 200, undefined, tokens)
		this.arguments = argumentsEnumerable
	}
	serialize(): { class: string } & any {
		const argumentsArray = this.arguments.map(a => a.serialize()).toArray()
		return {
			...super.serialize(),
			arguments: argumentsArray.length > 0 ? argumentsArray : undefined,
			returnType: this.returnType && this.returnType.serialize(),
			body: this.body && this.body.serialize(),
		}
	}
}
addDeserializer("lambdaOperator", data => data.hasOwnProperty("body") && data.symbol == "=>" ?
	new LambdaOperator(
		deserialize<ArgumentDeclaration>(data.arguments as ({ class: string } & any)[]),
		deserialize<Type.Expression>(data.returnType),
		deserialize<Expression>(data.body)!)
	: undefined)
