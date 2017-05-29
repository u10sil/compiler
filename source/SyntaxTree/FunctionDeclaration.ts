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
import { Source } from "./Source"
import { Statement } from "./Statement"
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
	constructor(symbol: Type.Name, readonly modifier: FunctionModifier, private typeParametersArray: Type.Name[], private argumentsArray: ArgumentDeclaration[], readonly returnType: Type.Expression | undefined, readonly body: Block | undefined, tokens: Tokens.Substance[]) {
		super(symbol.name, tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			class: "functionDeclaration",
			modifier: this.modifier != FunctionModifier.None ? FunctionDeclaration.modifierToString(this.modifier) : undefined,
			typeParameters: this.typeParametersArray.length > 0 ? this.typeParametersArray.map(t => t.serialize()) : undefined,
			arguments: this.argumentsArray.length > 0 ? this.argumentsArray.map(a => a.serialize()) : undefined,
			returnType: this.returnType && this.returnType.serialize(),
			body: this.body && this.body.serialize(),
		}
	}
	static modifierToString(modifier: FunctionModifier): string {
		let result: string
		switch (modifier) {
			case FunctionModifier.Abstract: result = "abstract"; break
			default:
			case FunctionModifier.None: result = ""; break
			case FunctionModifier.Override: result = "override"; break
			case FunctionModifier.Static: result = "static"; break
			case FunctionModifier.Virtual: result = "virtual"; break
		}
		return result
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
	static parse(source: Source): FunctionDeclaration | undefined {
		let result: FunctionDeclaration | undefined
		const modifier = FunctionDeclaration.parseModifier((source.peek() as Tokens.Identifier).name)
		if (source.peek(modifier == FunctionModifier.None ? 0 : 1)!.isIdentifier("func") && source.next() && (modifier == FunctionModifier.None || source.next())) {
			const symbol = Type.Name.parse(source.clone())
			if (!symbol)
				source.raise("Expected symbol in function declaration.")
			// TODO: add overload name parsing: ~overloadName
			const typeParameters = SymbolDeclaration.parseTypeParameters(source.clone())
			const argumentList = ArgumentDeclaration.parseAll(source.clone())
			let returnType: Type.Expression | undefined
			if (source.peek()!.isOperator("->")) {
				source.next() // consume "->"
				returnType = Type.Expression.parse(source)
			}
			const body = Block.parse(source)
			result = new FunctionDeclaration(symbol!, modifier, typeParameters, argumentList, returnType, body, source.mark())
		}
		return result
	}
}
Statement.addParser(FunctionDeclaration.parse)
