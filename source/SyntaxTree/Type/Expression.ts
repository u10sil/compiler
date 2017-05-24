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
import { Node } from "../Node"
import { Statement } from "../Statement"

export abstract class Expression extends Node {
	constructor(tokens: Tokens.Substance[]) {
		super(tokens)
	}
	private static typeParsers: ((source: Source) => Expression | undefined)[] = []
	static addParser(parser: (source: Source) => Expression | undefined) {
		Expression.typeParsers.push(parser)
	}
	static parse(source: Source): Expression | undefined {
		let result: Expression | undefined
		if (Expression.typeParsers.length > 0) {
			let i = 0
			do
				result = Expression.typeParsers[i++](source.clone())
			while (!result && i < Expression.typeParsers.length)
		}
		return result
	}
}
Statement.addParser(Expression.parse, 20)
