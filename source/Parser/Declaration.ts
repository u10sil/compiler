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

import * as Type from "./Type"
import { Source } from "./Source"
import * as Tokens from "../Tokens"
import * as SyntaxTree from "../SyntaxTree"

export function parseParameters(source: Source): SyntaxTree.Type.Name[] {
	const result: SyntaxTree.Type.Name[] = []
	if (source.peek()!.isOperator("<")) {
		do {
			source.fetch() // consume "<" or ","
			if (!source.peek()!.isIdentifier())
				source.raise("Expected type parameter")
			result.push(Type.Name.parse(source.clone())!)
		} while (source.peek()!.isSeparator(","))
		source.fetch() // consume ">"
	}
	return result
}
export function parseIdentifier(source: Source): string | null {
	return source.peek()!.isIdentifier() ? (source.fetch() as Tokens.Identifier).name : null
}
