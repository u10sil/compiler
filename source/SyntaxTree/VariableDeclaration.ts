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
import * as Tokens from "../Tokens"
import { SymbolDeclaration } from "./SymbolDeclaration"
import { Expression } from "./Expression"
import * as Type from "./Type"
import { addDeserializer, deserialize } from "./deserialize"

export class VariableDeclaration extends SymbolDeclaration {
	get class() { return "variableDeclaration" }
	constructor(symbol: string, readonly isStatic: boolean, readonly isConstant: boolean, readonly type: Type.Expression | undefined, readonly value: Expression | undefined, tokens?: Utilities.Iterable<Tokens.Substance>) {
		super(symbol, tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			isStatic: this.isStatic || undefined,
			isConstant: this.isConstant || undefined,
			type: this.type && this.type.serialize(),
			value: this.value && this.value.serialize(),
		}
	}
}
addDeserializer("variableDeclaration", data => data.hasOwnProperty("symbol") ? new VariableDeclaration(data.symbol, data.isStatic, data.isConstant, deserialize<Type.Expression>(data.type), deserialize<Expression>(data.value)) : undefined)
