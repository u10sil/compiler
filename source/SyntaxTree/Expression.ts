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
import { Statement } from "./Statement"
import { Source } from "./Source"

export abstract class Expression extends Statement {
	abstract get precedence(): number
	constructor(readonly type: Type.Expression | undefined, tokens: Tokens.Substance[]) {
		super(tokens)
	}
	private static expressionParsers: { parse: ((source: Source, precedence: number, previous: Expression | undefined) => Expression | undefined), priority: number }[] = []
	static addExpressionParser(parser: (source: Source, precedence: number, previous: Expression | undefined) => Expression | undefined, priority: number = 0) {
		Expression.expressionParsers.push({
			parse: parser,
			priority,
		})
		Expression.expressionParsers.sort((left, right) => left.priority < right.priority ? -1 : left.priority > right.priority ? 1 : 0)
	}
	static parse(source: Source, precedence: number = 0, previous?: Expression): Expression | undefined {
		let result: Expression | undefined
		if (Expression.expressionParsers.length > 0) {
			let i = 0
			do
				result = Expression.expressionParsers[i++].parse(source.clone(), precedence, previous)
			while (!result && i < Expression.expressionParsers.length)
			if (!result)
				result = previous
		}
		return result
	}
}
Statement.addParser(Expression.parse, 10)
