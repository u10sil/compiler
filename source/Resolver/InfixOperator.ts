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
	const declaration = scope.find(operator.symbol)
	const left = scope.resolve(operator.left)
	const right = scope.resolve(operator.right)
	return new SyntaxTree.InfixOperator(operator.symbol, operator.precedence, operator.precedence, left, right, operator.tokens)
}
addResolver("InfixOperator", resolve)
