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

import * as Tokens from "../../Tokens"
import { Source } from "../Source"
import { Expression } from "./Expression"
import { Identifier } from "./Identifier"

export class Assignment extends Expression {
	constructor(private left: Identifier, private right: Expression, tokens: Tokens.Substance[]) {
		super(tokens)
	}
	getLeft(): Identifier {
		return this.left
	}
	getRight(): Expression {
		return this.right
	}
	static parse(source: Source): Assignment {
		var result: Assignment
		if (source.peek().isIdentifier() && source.peek(1).isOperator("=")) {
			var left = new Identifier((<Tokens.Identifier>source.next()).getName(), source.mark())
			source.next() // consume "="
			var right = Expression.parse(source.clone())
			result = new Assignment(left, right, source.mark())
		}
		return result
	}
}
Expression.addParser(Assignment.parse)
