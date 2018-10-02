// Copyright (C) 2018  Simon Mika <simon@mika.se>
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
import * as Expression from "./Expression"
import * as SyntaxTree from "../SyntaxTree"
import { Utilities } from "@cogneco/mend"

export function parse(source: Source, precedance: number, previous?: SyntaxTree.Expression): SyntaxTree.Expression | undefined {
	let result: SyntaxTree.LambdaOperator | undefined
	if (previous && (previous instanceof SyntaxTree.Tuple || previous instanceof SyntaxTree.Identifier) && source.peek(0)!.isOperator("=>")) {
		const argumentList: SyntaxTree.ArgumentDeclaration[] = []
		if (previous instanceof SyntaxTree.Tuple)
			for (const argument of previous.elements)
				if (argument instanceof SyntaxTree.Identifier)
					argumentList.push(new SyntaxTree.ArgumentDeclaration(argument.name, argument.type, argument.tokens))
				else
					source.raise("Expected identifier in argument list of lambda function.", undefined, undefined, argument.region)
		else if (previous instanceof SyntaxTree.Identifier)
			argumentList.push(new SyntaxTree.ArgumentDeclaration(previous.name, previous.type, previous.tokens))
		source.fetch() // consume =>
		const body = Expression.parse(source)
		if (body)
			result = new SyntaxTree.LambdaOperator(Utilities.Enumerable.from(argumentList), undefined, body, source.mark())
		else
			source.raise("Missing body after lambda expression.")
	}
	return result
}
Expression.addParser(parse)
