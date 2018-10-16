// Copyright (C) 2015, 2017, 2018  Simon Mika <simon@mika.se>
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
import { VariableDeclaration } from "./VariableDeclaration"
import { Expression } from "./Expression"
import * as Type from "./Type"
import { addDeserializer, deserialize } from "./deserialize"
import { Node } from "./Node"

export class PropertyDeclaration extends VariableDeclaration {
	get class() { return "propertyDeclaration" }
	get noAssignment(): boolean { return !this.value }
	constructor(symbol: string, isConstant: boolean, readonly isStatic: boolean, type: Type.Expression | undefined, value: Expression | undefined, tokens?: Utilities.Enumerable<Tokens.Substance> | Node) {
		super(symbol, isConstant, type, value, tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			isStatic: this.isStatic || undefined,
		}
	}
}
addDeserializer("propertyDeclaration", data => data.hasOwnProperty("symbol") ? new PropertyDeclaration(data.symbol, data.isConstant, data.isStatic, deserialize<Type.Expression>(data.type), deserialize<Expression>(data.value)) : undefined)
