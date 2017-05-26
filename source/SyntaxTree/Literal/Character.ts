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
import * as Type from "../Type"
import { Source } from "../Source"
import { Expression } from "../Expression"
import { Abstract } from "./Abstract"

export class Character extends Abstract {
	constructor(readonly value: string, type: Type.Expression | undefined, tokens: Tokens.Substance[]) {
		super(type, tokens)
	}
	serialize(): { class: string } & any {
		return {
			class: "literal.character",
			value: this.value,
		}
	}
	static parse(source: Source, precedance: number, previous?: Expression): Expression | undefined {
		let result: Expression | undefined
		if (!previous && source.peek() instanceof Tokens.Literals.Character) {
			result = new Character((source.next() as Tokens.Literals.Character).value, Type.Expression.tryParse(source), source.mark())
			result = Expression.parse(source, result.precedence, result)
		}
		return result
	}
}
Expression.addExpressionParser(Character.parse)
