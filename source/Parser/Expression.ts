// Copyright (C) 2015, 2017  Simon Mika <simon@mika.se>
//
// This file is part of U10sil.
//
// U10sil is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// U10sil is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with U10sil.  If not, see <http://www.gnu.org/licenses/>.
//

import * as Statement from "./Statement"
import { Source } from "./Source"
import * as SyntaxTree from "../SyntaxTree"

const expressionParsers: { parse: ((source: Source, precedence: number, previous: SyntaxTree.Expression | undefined) => SyntaxTree.Expression | undefined), priority: number }[] = []
export function addParser(parser: (source: Source, precedence: number, previous: SyntaxTree.Expression | undefined) => SyntaxTree.Expression | undefined, priority: number = 0) {
	expressionParsers.push({
		parse: parser,
		priority,
	})
	expressionParsers.sort((left, right) => left.priority < right.priority ? -1 : left.priority > right.priority ? 1 : 0)
}
export function parse(source: Source, precedence: number = 0, previous?: SyntaxTree.Expression): SyntaxTree.Expression | undefined {
	let result: SyntaxTree.Expression | undefined
	if (expressionParsers.length > 0) {
		let i = 0
		do
			result = expressionParsers[i++].parse(source.clone(), precedence, previous)
		while (!result && i < expressionParsers.length)
		if (!result)
			result = previous
	}
	return result
}
Statement.addParser("default", parse, 10)
