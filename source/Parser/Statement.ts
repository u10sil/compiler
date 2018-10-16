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

import { Source } from "./Source"
import * as SyntaxTree from "../SyntaxTree"

type Parsers = { parse: ((source: Source) => SyntaxTree.Statement | undefined), priority: number }[]
const statementParsers: { [mode: string]: Parsers } = { default: [], class: [] }
export function addParser(mode: "default" | "class", parser: (source: Source) => SyntaxTree.Statement | undefined, priority: number = 0) {
	statementParsers[mode].push({
		parse: parser,
		priority,
	})
	statementParsers[mode].sort((left, right) => left.priority < right.priority ? -1 : left.priority > right.priority ? 1 : 0)
}
export function parse(mode: "default" | "class", source: Source): SyntaxTree.Statement | undefined {
	let result: SyntaxTree.Statement | undefined
	if (statementParsers[mode].length > 0) {
		let i = 0
		do {
			result = statementParsers[mode][i++].parse(source)
		} while (!result && i < statementParsers[mode].length)
	}
	return result
}
