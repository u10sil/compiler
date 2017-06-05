// Copyright (C) 2015, 2017  Simon Mika <simon@mika.se>
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
import { SymbolDeclaration } from "./SymbolDeclaration"
import * as Type from "./Type"
import { ArgumentDeclaration } from "./ArgumentDeclaration"
import { Block } from "./Block"
import { FunctionModifier } from "./FunctionModifier"

export class FunctionDeclaration extends SymbolDeclaration {
	get typeParameters(): Utilities.Iterator<Type.Name> {
		return new Utilities.ArrayIterator(this.typeParametersArray)
	}
	get argumentList(): Utilities.Iterator<ArgumentDeclaration> {
		return new Utilities.ArrayIterator(this.argumentsArray)
	}
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
	constructor(symbol: Type.Name, readonly modifier: FunctionModifier, private typeParametersArray: Type.Name[], private argumentsArray: ArgumentDeclaration[], readonly returnType: Type.Expression | undefined, readonly body: Block | undefined, tokens: () => Utilities.Iterator<Tokens.Substance>) {
		super(symbol.name, tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			class: "functionDeclaration",
			modifier: this.modifier != FunctionModifier.None ? this.modifierAsString : undefined,
			typeParameters: this.typeParametersArray.length > 0 ? this.typeParametersArray.map(t => t.serialize()) : undefined,
			arguments: this.argumentsArray.length > 0 ? this.argumentsArray.map(a => a.serialize()) : undefined,
			returnType: this.returnType && this.returnType.serialize(),
			body: this.body && this.body.serialize(),
		}
	}
}
