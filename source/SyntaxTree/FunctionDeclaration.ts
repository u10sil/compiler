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
import { SymbolDeclaration } from "./SymbolDeclaration"
import * as Type from "./Type"
import { ArgumentDeclaration } from "./ArgumentDeclaration"
import { Block } from "./Block"
import { FunctionModifier } from "./FunctionModifier"
import { addDeserializer, deserialize } from "./deserialize"
import { Node } from "./Node"

export class FunctionDeclaration extends SymbolDeclaration {
	get class() { return "functionDeclaration" }
	readonly arguments: Utilities.Enumerable<ArgumentDeclaration>
	private get modifierAsString(): string {
		let result: string
		switch (this.modifier) {
			case FunctionModifier.Abstract: result = "abstract"; break
			default:
			case FunctionModifier.None: result = ""; break
			case FunctionModifier.Override: result = "override"; break
			case FunctionModifier.Static: result = "static"; break
			case FunctionModifier.Virtual: result = "virtual"; break
		}
		return result
	}
	constructor(
		symbol: string, readonly modifier: FunctionModifier, readonly parameters: Utilities.Enumerable<Type.Name>, argumentsEnumerable: Utilities.Enumerable<ArgumentDeclaration>,
		readonly returnType: Type.Expression | undefined, readonly body: Block | undefined, tokens?: Utilities.Enumerable<Tokens.Substance> | Node) {
		super(symbol, tokens)
		this.arguments = argumentsEnumerable
	}
	serialize(): { class: string } & any {
		const parameters = this.parameters.map(t => t.serialize()).toArray()
		const argumentsArray = this.arguments.map(a => a.serialize()).toArray()
		return {
			...super.serialize(),
			modifier: this.modifier != FunctionModifier.None ? this.modifierAsString : undefined,
			parameters: parameters.length > 0 ? parameters : undefined,
			arguments: argumentsArray.length > 0 ? argumentsArray : undefined,
			returnType: this.returnType && this.returnType.serialize(),
			body: this.body && this.body.serialize(),
		}
	}
	static parseModifier(modifier: string): FunctionModifier {
		let result: FunctionModifier
		switch (modifier) {
			case "abstract": result = FunctionModifier.Abstract; break
			default: result = FunctionModifier.None; break
			case "override": result = FunctionModifier.Override; break
			case "static": result = FunctionModifier.Static; break
			case "virtual": result = FunctionModifier.Virtual; break
		}
		return result
	}
}
addDeserializer("functionDeclaration", data => data.hasOwnProperty("symbol") ?
	new FunctionDeclaration(
		data.symbol,
		FunctionDeclaration.parseModifier(data.modifier),
		deserialize<Type.Name>(data.parameters as ({ class: string } & any)[]),
		deserialize<ArgumentDeclaration>(data.arguments as ({ class: string } & any)[]),
		deserialize<Type.Expression>(data.returnType),
		deserialize<Block>(data.Block))
	: undefined)
