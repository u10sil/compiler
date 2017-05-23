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

import { Error, Utilities } from "@cogneco/mend"
import * as Tokens from "../../Tokens"
import { Source } from "../Source"
import { Statement } from "../Statement"
import { Declaration } from "../Declaration"
import * as Type from "../Type"

export class Variable extends Declaration {
	constructor(name: Type.Name, readonly isStatic: boolean, readonly isConstant: boolean, readonly type: Type.Expression, tokens: Tokens.Substance[]) {
		super(name.name, tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			class: "declarations.variable",
			isStatic: this.isStatic,
			isConstant: this.isConstant,
			type: this.type.serialize(),
		}
	}
	static parse(source: Source): Variable {
		let result: Variable
		if (source.peek().isIdentifier() && source.peek(1).isSeparator(":")) {
			const name = Type.Name.parse(source.clone())
			source.next() // consume ":"
			let done = false
			let isStatic = false
			let isConstant = false
			while (!done && source.peek().isIdentifier()) {
				switch ((source.peek() as Tokens.Identifier).name) {
					case "static":
						if (isStatic)
							source.raise("Multiple static keywords.", Error.Level.Recoverable)
						isStatic = true
						source.next() // consume "static"
						break
					case "const":
						if (isConstant)
							source.raise("Multiple const keywords.", Error.Level.Recoverable)
						isConstant = true
						source.next() // consume "const"
						break
					default:
						done = true
						break
				}
			}
			const type = Type.Expression.parse(source.clone())
			result = new Variable(name, isStatic, isConstant, type, source.mark())
		}
		return result
	}
}
Statement.addParser(Variable.parse)
