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

import * as Type from "../Type"
import * as Tokens from "../../Tokens"
import { Source } from "../Source"
import { Statement } from "../Statement"
import { Declaration } from "../Declaration"
import * as Expressions from "../Expressions"

//
// Declare-assign
// ID := EXPRESSION
// ID: TYPE = EXPRESSION
// Example:
//	list: List<T> = List<T> new()
//		list 			= Type.Name
//		List<T> 		= Type.Identifier
//		List<T> new()	= Expressions.Expression
//
export class Assignment extends Declaration {
	constructor(private left: Type.Name, private right: Expressions.Expression, private type: Type.Identifier, tokens: Tokens.Substance[]) {
		super(left.getName(), tokens)
	}
	getLeft(): Type.Name {
		return this.left
	}
	getRight(): Expressions.Expression {
		return this.right
	}
	getType(): Type.Identifier {
		return this.type
	}
	static parse(source: Source): Assignment {
		var result: Assignment
		var shorthand = false;
		if ((shorthand = Assignment.isDeclareAssignShorthand(source)) || Assignment.isDeclareAssign(source)) {
			var type: Type.Identifier = undefined
			var left = Type.Name.parse(source.clone())
			source.next() // consume ":=" or ":"
			if (!shorthand) {
				type = Type.Identifier.parse(source.clone())
				source.next() // consume "="
			}
			var right = Expressions.Expression.parse(source.clone())
			result = new Assignment(left, right, type, source.mark())
		}
		return result
	}
	// True if ID := EXPRESSION
	private static isDeclareAssignShorthand(source: Source): boolean {
		return source.peek().isIdentifier() && source.peek(1).isOperator(":=")
	}
	// True if ID: TYPE = EXPRESSION
	private static isDeclareAssign(source: Source): boolean {
		return source.peek().isIdentifier() && source.peek(1).isSeparator(":") && source.peek(2).isIdentifier() && source.peek(3).isOperator("=")
	}
}
Statement.addParser(Assignment.parse)
