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

import { Source } from "./Source"
import * as Tokens from "../Tokens"
import { Declaration } from "./Declaration"
import * as Type from "./Type"

export class ArgumentDeclaration extends Declaration {
	constructor(symbol: string, public /* TODO: syntax tree should be immutable */ type: Type.Expression | undefined, tokens: Tokens.Substance[]) {
		super(symbol, tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			class: "argumentDeclaration",
			type: this.type && this.type.serialize(),
		}
	}
	static parse(source: Source): ArgumentDeclaration | undefined {
		let result: ArgumentDeclaration | undefined
		if (source.peek()!.isIdentifier()) {
			//
			// handles cases "x" and "x: Type"
			//
			const symbol = (source.next() as Tokens.Identifier).name
			const type = Type.Expression.tryParse(source)
			result = new ArgumentDeclaration(symbol, type, source.mark())
		} else if (source.peek()!.isOperator("=") || source.peek()!.isSeparator(".")) {
			//
			// Handles syntactic sugar cases ".argument" and "=argument"
			// The type of the argument will have to be resolved later
			//
			source.next() // consume "=" or "."
			result = new ArgumentDeclaration((source.next() as Tokens.Identifier).name, undefined, source.mark())
		}
		return result
	}
	static parseAll(source: Source): ArgumentDeclaration[] {
		const result: ArgumentDeclaration[] = []
		if (source.peek()!.isSeparator("(")) {
			do {
				source.next() // consume: ( or ,
				result.push(ArgumentDeclaration.parse(source.clone())!)
			} while (source.peek()!.isSeparator(","))
			if (!source.next()!.isSeparator(")"))
				source.raise("Expected \")\"")
		}
		return result
	}
}
