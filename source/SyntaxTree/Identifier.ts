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
import * as Type from "./Type"
import { Source } from "./Source"
import { Expression } from "./Expression"

//
// TODO: Make this abstract
// 	Derived:
// 		NamedIdentifier		: a, abc, foobar
// 		TupleIdentifier		: (a, b, c)
// 		DiscardedIdentifier	: (a, b, _), where '_' is the discarded identifier
//
export class Identifier extends Expression {
	get precedence() { return Number.MAX_VALUE }
	constructor(readonly name: string, type: Type.Expression | undefined, tokens: Tokens.Substance[]) {
		super(type, tokens)
	}
	serialize(): { class: string } & any {
		return {
			class: "identifier",
			name: this.name,
		}
	}
	static parse(source: Source, precedance: number, previous?: Expression): Expression | undefined {
		let result: Expression | undefined
		if (!previous && source.peek()!.isIdentifier() /*&& !source.peek(1).isOperator() && !source.peek(1).isSeparator()*/)
			result = Expression.parse(source, precedance, new Identifier((source.next() as Tokens.Identifier).name, Type.Expression.tryParse(source), source.mark()))
		return result
	}
}
Expression.addExpressionParser(Identifier.parse, 10)
