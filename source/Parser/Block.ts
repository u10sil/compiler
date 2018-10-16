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

import { Utilities } from "@cogneco/mend"
import { Source } from "./Source"
import * as Statement from "./Statement"
import * as Expression from "./Expression"
import * as SyntaxTree from "../SyntaxTree"

export function parse(source: Source): SyntaxTree.Block | undefined {
	let result: SyntaxTree.Block | undefined
	if (source.peek()!.isSeparator("{") && !source.peek(2)!.isSeparator(":")) {
		source.fetch() // consume: {
		const statements: SyntaxTree.Statement[] = []
		let next: SyntaxTree.Statement | undefined
		while (source.peek() &&	!source.peek()!.isSeparator("}") && (next = Statement.parse("default", source.clone()))) {
			statements.push(next)
		}
		if (!source.fetch()!.isSeparator("}"))
			source.raise("Expected \"}\"")
		result = new SyntaxTree.Block(Utilities.Enumerable.from(statements), source.mark())
	}
	return result
}
Expression.addParser(parse)
