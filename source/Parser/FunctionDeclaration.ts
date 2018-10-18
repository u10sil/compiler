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
import * as Statement from "./Statement"
import * as Declaration from "./Declaration"
import * as Type from "./Type"
import * as ArgumentDeclaration from "./ArgumentDeclaration"
import * as Block from "./Block"
import * as SyntaxTree from "../SyntaxTree"
import { Utilities } from "@cogneco/mend"

export function parse(source: Source): SyntaxTree.FunctionDeclaration | undefined {
	let result: SyntaxTree.FunctionDeclaration | undefined
	if (source.peek()!.isIdentifier("fun") && source.fetch()) {
		const symbol = Declaration.parseIdentifier(source.clone())
		if (!symbol)
			source.raise("Expected symbol in function declaration.")
		const parameters = Declaration.parseParameters(source.clone())
		const argumentList = ArgumentDeclaration.parseAll(source.clone())
		let returnType: SyntaxTree.Type.Expression | undefined
		if (source.peek()!.isOperator("->")) {
			source.fetch() // consume "->"
			returnType = Type.parse(source.clone())
		}
		const body = Block.parse(source.clone())
		result = new SyntaxTree.FunctionDeclaration(symbol!, Utilities.Enumerable.from(parameters), Utilities.Enumerable.from(argumentList), returnType, body, source.mark())
	}
	return result
}
Statement.addParser("default", parse)
