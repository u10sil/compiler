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

import { Source } from "../Source"
import * as Tokens from "../../Tokens"
import { Statement } from "../Statement"
import { Declaration } from "../Declaration"
import * as Type from "../Type"
import { Assignment } from "./Assignment"

export class Argument extends Declaration {
	constructor(symbol: string, public /* TODO: syntax tree should be immutable */ type: Type.Expression, tokens: Tokens.Substance[]) {
		super(symbol, tokens)
	}
	static parse(source: Source): Argument {
		let result: Argument
		let assignment: Assignment
		if ((assignment = Assignment.parse(source.clone()))) {
			//
			// handles syntactic sugar case "argument := value", since this is a declare-assign operation,
			// we let the Assignment parser handle it.
			//
			// TODO: Is this the correct way to go?
			//
			result = new Argument(assignment.symbol, assignment.right, source.mark())
		} else if (source.peek().isIdentifier()) {
			//
			// handles cases "x" and "x: Type"
			//
			const symbol = (source.next() as Tokens.Identifier).name
			let type: Type.Expression
			if (source.peek().isSeparator(":")) {
				source.next() // consume ":"
				type = Type.Expression.parse(source.clone())
			}
			result = new Argument(symbol, type, source.mark())
		} else if (source.peek().isOperator("=") || source.peek().isSeparator(".")) {
			//
			// Handles syntactic sugar cases ".argument" and "=argument"
			// The type of the argument will have to be resolved later
			//
			source.next() // consume "=" or "."
			result = new Argument((source.next() as Tokens.Identifier).name, undefined, source.mark())
		}
		return result
	}
	static parseAll(source: Source): Argument[] {
		const result: Argument[] = []
		if (source.peek().isSeparator("(")) {
			do {
				source.next() // consume: ( or ,
				result.push(Argument.parse(source.clone()))
			} while (source.peek().isSeparator(","))
			if (!source.next().isSeparator(")"))
				source.raise("Expected \")\"")
			//
			// Iterate through the argument list and assign a type to arguments whose type are not set explicitly.
			// This is useful for cases where the argument list is written in reduced form.
			// 	Example: foo: func (width, height: Int, x, y, z: Float)
			//
			let previousArgumentType = result[result.length - 1].type
			for (let i = result.length - 1; i >= 0; i--) {
				const currentArgumentType = result[i].type
				if (currentArgumentType && currentArgumentType !== previousArgumentType)
					previousArgumentType = currentArgumentType
				if (!currentArgumentType)
					result[i].type = previousArgumentType
			}
		}
		return result
	}
}
