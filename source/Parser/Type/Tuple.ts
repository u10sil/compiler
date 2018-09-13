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

import * as Type from "./"
import { Source } from "../Source"
import * as SyntaxTree from "../../SyntaxTree"
import { Utilities } from "@cogneco/mend"

function parse(source: Source): SyntaxTree.Type.Expression | undefined {
	let result: SyntaxTree.Type.Expression | undefined
	if (source.peek()!.isSeparator("(") && source.fetch()) {
		const children: SyntaxTree.Type.Expression[] = []
		let child: SyntaxTree.Type.Expression | undefined
		while (child = Type.parse(source.clone())) {
			children.push(child)
			if (!source.peek()!.isSeparator(","))
				break
			source.fetch() // consume ,
		}
		if (!source.fetch()!.isSeparator(")"))
			source.raise("Expected \")\"")
		result = new SyntaxTree.Type.Tuple(Utilities.Enumerable.from(children), source.mark())
	}
	return result
}
Type.addParser(parse)
