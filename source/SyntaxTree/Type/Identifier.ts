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

import { Utilities } from "@cogneco/mend"
import * as Tokens from "../../Tokens"
import { Source } from "../Source"
import { Expression } from "./Expression"
import { Name } from "./Name"

export class Identifier extends Name {
	get typeParameters(): Utilities.Iterator<Identifier> {
		return new Utilities.ArrayIterator(this.typeParametersArray)
	}
	constructor(name: string, private typeParametersArray: Identifier[], tokens: Tokens.Substance[]) {
		super(name, tokens)
	}
	static parse(source: Source): Identifier {
		let result: Identifier
		if (source.peek().isIdentifier()) {
			const name = (source.next() as Tokens.Identifier).name
			const typeParameters: Identifier[] = []
			if (source.peek().isOperator("<")) {
				do {
					source.next() // consume "<" or ","
					if (!source.peek().isIdentifier())
						source.raise("Expected type parameter")
					typeParameters.push(Identifier.parse(source.clone()))
				} while (source.peek().isSeparator(","))
				source.next() // consume ">"
			}
			result = new Identifier(name, typeParameters, source.mark())
		}
		return result
	}
}
Expression.addParser(Identifier.parse)
