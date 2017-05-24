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

import * as Tokens from "../Tokens"
import { Source } from "./Source"
import { Expression } from "./Expression"
import { Identifier } from "./Identifier"

export class Assignment extends Expression {
	constructor(readonly left: Identifier, readonly right: Expression, tokens: Tokens.Substance[]) {
		super(right.type, tokens)
	}
	serialize(): { class: string } & any {
		return {
			class: "assignment",
			left: this.left.serialize(),
			right: this.right.serialize(),
		}
	}
	static parse(source: Source): Assignment | undefined {
		let result: Assignment | undefined
		if (source.peek()!.isIdentifier() && source.peek(1)!.isOperator("=")) {
			const left = new Identifier((source.next() as Tokens.Identifier).name, undefined, source.mark())
			source.next() // consume "="
			const right = Expression.parse(source.clone())
			if (right)
				result = new Assignment(left, right, source.mark())
			else
				source.raise("Missing right hand of assignment expression")
		}
		return result
	}
}
Expression.addParser(Assignment.parse)
