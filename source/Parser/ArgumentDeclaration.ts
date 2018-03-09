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
import * as Tokens from "../Tokens"
import * as Type from "./Type"
import * as SyntaxTree from "../SyntaxTree"

export function parse(source: Source): SyntaxTree.ArgumentDeclaration | undefined {
	let result: SyntaxTree.ArgumentDeclaration | undefined
	if (source.peek()!.isIdentifier()) {
		//
		// handles cases "x" and "x: Type"
		//
		const symbol = (source.fetch() as Tokens.Identifier).name
		const type = Type.tryParse(source)
		result = new SyntaxTree.ArgumentDeclaration(symbol, type, source.mark())
	} else if (source.peek()!.isOperator("=") || source.peek()!.isSeparator(".")) {
		//
		// Handles syntactic sugar cases ".argument" and "=argument"
		// The type of the argument will have to be resolved later
		//
		source.fetch() // consume "=" or "."
		result = new SyntaxTree.ArgumentDeclaration((source.fetch() as Tokens.Identifier).name, undefined, source.mark())
	}
	return result
}
export function parseAll(source: Source): SyntaxTree.ArgumentDeclaration[] {
	const result: SyntaxTree.ArgumentDeclaration[] = []
	if (source.peek()!.isSeparator("(")) {
		do {
			source.fetch() // consume: ( or ,
			result.push(parse(source.clone())!)
		} while (source.peek()!.isSeparator(","))
		if (!source.fetch()!.isSeparator(")"))
			source.raise("Expected \")\"")
	}
	return result
}
