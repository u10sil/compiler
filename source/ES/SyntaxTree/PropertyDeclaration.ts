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
import { VariableDeclaration } from "./VariableDeclaration"
import { Identifier } from "./Identifier"
import { Assignment } from "./Assignment"
import { ExpressionStatement } from "./ExpressionStatement"

export class PropertyDeclaration extends VariableDeclaration {
	get class() { return "PropertyDeclaration" }
	get declaration() { return new PropertyDeclaration(this.symbol, this.type, this.isConstant, this.isStatic, undefined, this.tokens) }
	get assignment() { return this.expression ? new ExpressionStatement(new Assignment(new Identifier(this.symbol), this.expression, this.expression.tokens)) : undefined }
	constructor(symbol: string, type: Type.Expression, isConstant: boolean, readonly isStatic: boolean, expression?: Expression, tokens?: Utilities.Enumerable<Tokens.Substance>) {
		super(symbol, isConstant, type, expression, tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			expression: this.expression ? this.expression.serialize() : undefined,
		}
	}
}
