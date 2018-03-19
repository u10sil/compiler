// Copyright (C) 2018  Simon Mika <simon@mika.se>
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
import { Expression } from "./Expression"
import * as SyntaxTree from "../../SyntaxTree"
import { Node } from "./Node"

export class FunctionCall extends Expression {
	get class() { return "FunctionCall" }
	constructor(readonly functionExpression: Expression, readonly argumentExpressions: Utilities.Enumerable<Expression>, readonly tokens?: Utilities.Enumerable<Tokens.Substance>) {
		super(tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			function: this.functionExpression.serialize(),
			arguments: this.argumentExpressions.map(a => a.serialize()).toArray(),
		}
	}
}
function convert(node: SyntaxTree.FunctionCall): FunctionCall {
	return new FunctionCall(Node.convert(node.functionExpression), Node.convert(node.arguments), node.tokens)
}
Node.addConverter<SyntaxTree.FunctionCall>("functionCall", node => convert(node))
