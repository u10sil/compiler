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
	private get modifierAsString(): string {
		let result: string
		switch (this.modifier) {
			case MethodModifier.Abstract: result = "abstract"; break
			default:
			case MethodModifier.None: result = ""; break
			case MethodModifier.Override: result = "override"; break
			case MethodModifier.Static: result = "static"; break
			case MethodModifier.Virtual: result = "virtual"; break
		}
		return result
	}
	constructor(
		symbol: string,
		readonly modifier: MethodModifier,
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
			modifier: this.modifier != MethodModifier.None ? this.modifierAsString : undefined,
		}
	}
	static parseModifier(modifier: string): MethodModifier {
		let result: MethodModifier
		switch (modifier) {
			case "abstract": result = MethodModifier.Abstract; break
			default: result = MethodModifier.None; break
			case "override": result = MethodModifier.Override; break
			case "static": result = MethodModifier.Static; break
			case "virtual": result = MethodModifier.Virtual; break
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
