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
import { Statement } from "./Statement"
import { Declaration } from "./Declaration"
import { Expression } from "./Expression"
import * as Type from "./Type"

export class VariableDeclaration extends Declaration {
	constructor(name: Type.Name, readonly isStatic: boolean, readonly isConstant: boolean, readonly type: Type.Expression | undefined, readonly value: Expression | undefined, tokens: Tokens.Substance[]) {
		super(name.name, tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			class: "VariableDeclaration",
			isStatic: this.isStatic,
			isConstant: this.isConstant,
			type: this.type && this.type.serialize(),
			value: this.value && this.value.serialize(),
		}
	}
	static parse(source: Source): VariableDeclaration | undefined {
		let result: VariableDeclaration | undefined
		const isStatic = source.peek()!.isIdentifier("static")
		const next = source.peek(isStatic ? 1 : 0)
		let isConstant = false
		if (!!next && next.isIdentifier("var") || (isConstant = next!.isIdentifier("let"))) {
			if (isStatic)
				source.next() // consume "static"
			source.next() // consume "var" or "let"
			const name = Type.Name.parse(source.clone())
			if (!name)
				source.raise("Expected symbol in variable declaration.")
			const type = source.peek()!.isSeparator(":") && source.next() ? Type.Expression.parse(source.clone()) : undefined
			let value: Expression | undefined
			if (source.peek()!.isOperator("=") && source.next())
				value = Expression.parse(source.clone())
			result = new VariableDeclaration(name!, isStatic, isConstant, type, value, source.mark())
		}
		return result
	}
}
Statement.addParser(VariableDeclaration.parse)
