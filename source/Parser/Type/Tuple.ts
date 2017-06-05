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

import * as Type from "./"
import { Source } from "../Source"
import * as SyntaxTree from "../../SyntaxTree"

function parse(source: Source): SyntaxTree.Type.Expression | undefined {
	let result: SyntaxTree.Type.Expression | undefined
	if (source.peek()!.isSeparator("(") && source.next()) {
		const children: SyntaxTree.Type.Expression[] = []
		let child: SyntaxTree.Type.Expression | undefined
		while (child = Type.parse(source.clone())) {
			children.push(child)
			if (!source.peek()!.isSeparator(","))
				break
			source.next() // consume ,
		}
		if (!source.next()!.isSeparator(")"))
			source.raise("Expected \")\"")
		result = new SyntaxTree.Type.Tuple(children, source.mark())
	}
	return result
}
Type.addParser(parse)
