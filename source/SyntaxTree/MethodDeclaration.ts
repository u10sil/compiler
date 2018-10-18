// Copyright (C) 2015, 2017, 2018  Simon Mika <simon@mika.se>
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
import { FunctionDeclaration } from "./FunctionDeclaration"
import * as Type from "./Type"
import { ArgumentDeclaration } from "./ArgumentDeclaration"
import { Block } from "./Block"
import { MethodModifier } from "./MethodModifier"
import { addDeserializer, deserialize } from "./deserialize"
import { Node } from "./Node"

export class MethodDeclaration extends FunctionDeclaration {
	get class() { return "methodDeclaration" }
	readonly arguments: Utilities.Enumerable<ArgumentDeclaration>
	constructor(
		symbol: string,
		readonly modifier: MethodModifier | undefined,
		parameters: Utilities.Enumerable<Type.Name>,
		argumentsEnumerable: Utilities.Enumerable<ArgumentDeclaration>,
		returnType: Type.Expression | undefined,
		body: Block | undefined,
		tokens?: Utilities.Enumerable<Tokens.Substance> | Node) {
		super(symbol, parameters, argumentsEnumerable, returnType, body, tokens)
		this.arguments = argumentsEnumerable
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			modifier: this.modifier,
		}
	}
	static parseModifier(modifier: string): MethodModifier | undefined {
		let result: MethodModifier | undefined
		switch (modifier) {
			case "abstract":
			case "override":
			case "static":
			case "virtual":
				result = modifier
				break
			default:
				break
		}
		return result
	}
}
addDeserializer("methodDeclaration", data => data.hasOwnProperty("symbol") ?
	new MethodDeclaration(
		data.symbol,
		MethodDeclaration.parseModifier(data.modifier),
		deserialize<Type.Name>(data.parameters as ({ class: string } & any)[]),
		deserialize<ArgumentDeclaration>(data.arguments as ({ class: string } & any)[]),
		deserialize<Type.Expression>(data.returnType),
		deserialize<Block>(data.body))
	: undefined)
