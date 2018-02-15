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

import * as SyntaxTree from "../SyntaxTree"
import { Scope, addResolver } from "./Scope"

function resolve(operator: SyntaxTree.InfixOperator, scope: Scope): SyntaxTree.InfixOperator {
	return new SyntaxTree.InfixOperator(operator.symbol, operator.precedence, operator.precedence, scope.resolve(operator.left), scope.resolve(operator.right), scope.find(operator.symbol), operator.tokens)
}
addResolver("infixOperator", (operator, scope) => resolve(operator as SyntaxTree.InfixOperator, scope))
