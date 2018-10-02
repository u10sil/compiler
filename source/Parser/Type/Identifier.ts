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

import * as Tokens from "../../Tokens"
import { Source } from "../Source"
import * as Type from "./"
import * as SyntaxTree from "../../SyntaxTree"
import { Utilities } from "@cogneco/mend"

export function parse(source: Source): SyntaxTree.Type.Identifier | undefined {
	let result: SyntaxTree.Type.Identifier | undefined
	if (source.peek()!.isIdentifier()) {
		const name = (source.fetch() as Tokens.Identifier).name
		const parameters: SyntaxTree.Type.Identifier[] = []
		if (source.peek()!.isOperator("<")) {
			do {
				source.fetch() // consume "<" or ","
				if (!source.peek()!.isIdentifier())
					source.raise("Expected type parameter")
				parameters.push(parse(source.clone())!)
			} while (source.peek()!.isSeparator(","))
			source.fetch() // consume ">"
		}
		switch (name) {
			case "number":
			case "string":
			case "boolean":
				result = new SyntaxTree.Type.Primitive(name, source.mark())
				break
			default:
				result = new SyntaxTree.Type.Identifier(name, Utilities.Enumerable.from(parameters), source.mark())
				break
		}
	}
	return result
}
Type.addParser(source => parse(source))
