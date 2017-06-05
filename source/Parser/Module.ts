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
import { Source } from "./Source"
import * as Statement from "./Statement"
import * as SyntaxTree from "../SyntaxTree"

export function parse(source: Source): SyntaxTree.Module | undefined {
	let result: SyntaxTree.Module | undefined
	const peeked = source.peek()
	if (peeked != undefined && !(peeked instanceof Tokens.EndOfFile)) {
		const statements: SyntaxTree.Statement[] = []
		let next: SyntaxTree.Statement | undefined
		while (next = Statement.parse(source.clone()))
			statements.push(next)
		if (!(source.next() instanceof Tokens.EndOfFile))
			source.raise("Missing end of file.")
		result = new SyntaxTree.Module(statements, source.mark())
	}
	return result
}
