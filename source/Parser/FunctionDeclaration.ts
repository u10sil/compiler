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
import * as Declaration from "./Declaration"
import * as Type from "./Type"
import * as ArgumentDeclaration from "./ArgumentDeclaration"
import * as Block from "./Block"
import * as SyntaxTree from "../SyntaxTree"
import { Utilities } from "@cogneco/mend"

export function parse(source: Source): SyntaxTree.FunctionDeclaration | undefined {
	let result: SyntaxTree.FunctionDeclaration | undefined
	const modifier = SyntaxTree.FunctionDeclaration.parseModifier((source.peek() as Tokens.Identifier).name)
	if (source.peek(modifier == SyntaxTree.FunctionModifier.None ? 0 : 1)!.isIdentifier("func") && source.fetch() && (modifier == SyntaxTree.FunctionModifier.None || source.fetch())) {
		const symbol = Declaration.parseIdentifier(source.clone())
		if (!symbol)
			source.raise("Expected symbol in function declaration.")
		// TODO: add overload name parsing: ~overloadName
		const parameters = Declaration.parseParameters(source.clone())
		const argumentList = ArgumentDeclaration.parseAll(source.clone())
		let returnType: SyntaxTree.Type.Expression | undefined
		if (source.peek()!.isOperator("->")) {
			source.fetch() // consume "->"
			returnType = Type.parse(source.clone())
		}
		const body = Block.parse(source.clone())
		result = new SyntaxTree.FunctionDeclaration(symbol!, modifier, Utilities.Enumerable.from(parameters), Utilities.Enumerable.from(argumentList), returnType, body, source.mark())
	}
	return result
}
Statement.addParser(parse)
