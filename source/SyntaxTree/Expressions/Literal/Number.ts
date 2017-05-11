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

import * as Tokens from "../../../Tokens"
import { Source } from "../../Source"
import { Expression } from "../Expression"

export class Number extends Expression {
	constructor(private value: number, tokens: Tokens.Substance[]) {
		super(tokens)
	}
	getValue(): number { return this.value }
	static parse(source: Source): Number {
		var result: Number
		if (source.peek() instanceof Tokens.Literals.Number)
			result = new Number((<Tokens.Literals.Number>source.next()).getValue(), source.mark())
		return result
	}
}
Expression.addParser(Number.parse)
