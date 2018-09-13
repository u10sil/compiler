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

import { Utilities } from "@cogneco/mend"
import * as Tokens from "../Tokens"
import { SymbolDeclaration } from "./SymbolDeclaration"
import { Expression } from "./Expression"
import * as Type from "./Type"
import { addDeserializer, deserialize } from "./deserialize"
import { Node } from "./Node"

export class VariableDeclaration extends SymbolDeclaration {
	get class() { return "variableDeclaration" }
	get noAssignment(): boolean { return !this.value }
	constructor(symbol: string, readonly isConstant: boolean, readonly isStatic: boolean, readonly type: Type.Expression | undefined, readonly value: Expression | undefined, tokens?: Utilities.Enumerable<Tokens.Substance> | Node) {
		super(symbol, tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			isConstant: this.isConstant || undefined,
			isStatic: this.isStatic || undefined,
			type: this.type && this.type.serialize(),
			value: this.value && this.value.serialize(),
		}
	}
}
addDeserializer("variableDeclaration", data => data.hasOwnProperty("symbol") ? new VariableDeclaration(data.symbol, data.isConstant, data.isStatic, deserialize<Type.Expression>(data.type), deserialize<Expression>(data.value)) : undefined)
