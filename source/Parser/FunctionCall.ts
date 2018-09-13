// Copyright (C) 2017  Simon Mika <simon@mika.se>
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

import * as Type from "./Type"
import { Source } from "./Source"
import * as Expression from "./Expression"
import * as Tuple from "./Tuple"
import * as SyntaxTree from "../SyntaxTree"
import { Utilities } from "@cogneco/mend"

export function parse(source: Source, precedance: number, previous?: SyntaxTree.Expression): SyntaxTree.Expression | undefined {
	let result: SyntaxTree.Expression | undefined
	if (previous && source.peek()!.isSeparator("(") && precedance < 200) {
		const elements = Tuple.parseElements(source)
		result = Expression.parse(source, precedance, new SyntaxTree.FunctionCall(previous, Utilities.Enumerable.from(elements), Type.tryParse(source), source.mark()))
	}
	return result
}
Expression.addParser(parse, 10)
