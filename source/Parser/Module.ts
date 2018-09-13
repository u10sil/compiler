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

import * as Tokens from "../Tokens"
import { Source } from "./Source"
import * as Statement from "./Statement"
import * as SyntaxTree from "../SyntaxTree"
import { Utilities } from "@cogneco/mend"

export function parse(source: Source): SyntaxTree.Module | undefined {
	let result: SyntaxTree.Module | undefined
	const peeked = source.peek()
	if (peeked != undefined && !(peeked instanceof Tokens.EndOfFile)) {
		const statements: SyntaxTree.Statement[] = []
		let next: SyntaxTree.Statement | undefined
		while (next = Statement.parse(source.clone()))
			statements.push(next)
		if (!(source.fetch() instanceof Tokens.EndOfFile))
			source.raise("Missing end of file.")
		let name = statements.length > 0 && statements[0].region ? statements[0].region!.resource.name : "unnamed"
		if (name && name.endsWith(".u10"))
			name = name.substr(0, name.length - 6)
		result = new SyntaxTree.Module(name, Utilities.Enumerable.from(statements), source.mark())
	}
	return result
}
