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

import { Source } from "./Source"
import { Node } from "./Node"
import * as Tokens from "../Tokens"

export abstract class Statement extends Node {
	constructor(tokens: Tokens.Substance[]) {
		super(tokens)
	}
	private static statementParsers: { parse: ((source: Source) => Statement), priority: number }[] = []
	static addParser(parser: (source: Source) => Statement, priority: number = 0) {
		Statement.statementParsers.push({
			parse: parser,
			priority: priority
		});
		Statement.statementParsers.sort((left, right) => left.priority < right.priority ? -1 : left.priority > right.priority ? 1 : 0);
	}
	static parse(source: Source): Statement {
		var result: Statement
		if (Statement.statementParsers.length > 0) {
			var i = 0
			do {
				result = Statement.statementParsers[i++].parse(source)
			} while (!result && i < Statement.statementParsers.length)
		}
		return result
	}
}
