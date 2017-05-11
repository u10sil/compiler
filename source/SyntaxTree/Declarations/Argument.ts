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
/// <reference path="../../Tokens/Token" />
/// <reference path="../../Tokens/Identifier" />
/// <reference path="../../Tokens/Separator" />
/// <reference path="../../Tokens/Substance" />
import { Statement } from "../Statement"
import { Declaration } from "../Declaration"
/// <reference path="../Type/Name" />
/// <reference path="../Type/Expression" />
import { Assignment } from "./Assignment"

export class Argument extends Declaration {
	constructor(symbol: string, private type: Type.Expression, tokens: Tokens.Substance[]) {
		super(symbol, tokens)
	}
	getType(): Type.Expression {
		return this.type
	}
	static parse(source: Source): Argument {
		var result: Argument
		var assignment: Assignment
		if ((assignment = Assignment.parse(source.clone()))) {
			//
			// handles syntactic sugar case "argument := value", since this is a declare-assign operation,
			// we let the Assignment parser handle it.
			//
			// TODO: Is this the correct way to go?
			//
			result = new Argument(assignment.getSymbol(), assignment.getRight(), source.mark())
		} else if (source.peek().isIdentifier()) {
			//
			// handles cases "x" and "x: Type"
			//
			var symbol = (<Tokens.Identifier>source.next()).getName()
			var type: Type.Expression;
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
			result = new Argument((<Tokens.Identifier>source.next()).getName(), undefined, source.mark())
		}
		return result
	}
	static parseAll(source: Source): Argument[] {
		var result: Argument[] = []
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
			var previousArgumentType = result[result.length - 1].getType()
			for (var i = result.length - 1; i >= 0; i--) {
				var currentArgumentType = result[i].getType()
				if (currentArgumentType && currentArgumentType !== previousArgumentType)
					previousArgumentType = currentArgumentType
				if (!currentArgumentType)
					result[i].type = previousArgumentType
			}
		}
		return result
	}
}
