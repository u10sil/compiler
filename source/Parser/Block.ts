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
import * as Statement from "./Statement"
import * as SyntaxTree from "../SyntaxTree"

export function parse(source: Source): SyntaxTree.Block | undefined {
	let result: SyntaxTree.Block | undefined
	if (source.peek()!.isSeparator("{")) {
		source.next() // consume: {
		const statements: SyntaxTree.Statement[] = []
		let next: SyntaxTree.Statement | undefined
		while (source.peek() &&	!source.peek()!.isSeparator("}") && (next = Statement.parse(source.clone()))) {
			statements.push(next)
		}
		if (!source.next()!.isSeparator("}"))
			source.raise("Expected \"}\"")
		result = new SyntaxTree.Block(statements, source.mark())
	}
	return result
}

Statement.addParser(parse)
