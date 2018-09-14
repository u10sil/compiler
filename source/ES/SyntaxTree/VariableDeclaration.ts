// Copyright (C) 2018  Simon Mika <simon@mika.se>
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
import * as Tokens from "../../Tokens"
import { Expression } from "./Expression"
import * as Type from "./Type"
import { SymbolDeclaration } from "./SymbolDeclaration"
import { Assignment } from "./Assignment"
import { ExpressionStatement } from "./ExpressionStatement"

export class VariableDeclaration extends SymbolDeclaration {
	get class() { return "VariableDeclaration" }
	get declaration() { return new VariableDeclaration(this.symbol, this.type, this.isConstant, this.isStatic, undefined, this.tokens) }
	get assignment() { return this.expression ? new ExpressionStatement(new Assignment(this.symbol, this.expression, this.expression.tokens)) : undefined }
	constructor(symbol: string, type: Type.Expression, readonly isConstant: boolean, readonly isStatic: boolean, readonly expression?: Expression, tokens?: Utilities.Enumerable<Tokens.Substance>) {
		super(symbol, type, tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			expression: this.expression ? this.expression.serialize() : undefined,
		}
	}
}
