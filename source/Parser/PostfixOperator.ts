// Copyright (C) 2017  Simon Mika <simon@mika.se>
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
import * as Type from "./Type"
import * as Expression from "./Expression"
import { Source } from "./Source"
import * as SyntaxTree from "../SyntaxTree"

export function parse(source: Source, precedence: number, previous?: SyntaxTree.Expression): SyntaxTree.Expression | undefined {
	let result: SyntaxTree.Expression | undefined
	let operatorPrecedence: number | undefined
	if (previous && source.peek()!.isOperator(o => (operatorPrecedence = SyntaxTree.PostfixOperator.getPrecedence(o)) != undefined) && precedence < operatorPrecedence!)
		result = Expression.parse(source, precedence, new SyntaxTree.PostfixOperator((source.fetch() as Tokens.Operator).symbol, operatorPrecedence!, previous, Type.tryParse(source), source.mark()))
	return result
}
Expression.addParser(parse, 10)
