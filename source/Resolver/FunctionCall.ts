// Copyright (C) 2017, 2018  Simon Mika <simon@mika.se>
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

import { Error } from "@cogneco/mend"
import * as SyntaxTree from "../SyntaxTree"
import { Scope, addResolver } from "./Scope"

function resolve(scope: Scope, node: SyntaxTree.FunctionCall) {
	scope.resolve(node.functionExpression)
	scope.resolve(node.argumentList)
	scope.resolve(node.type)
	const functionType = scope.getType(node.functionExpression)
	if (functionType instanceof SyntaxTree.Type.Function)
		scope.setType(node, functionType.result)
	else
		scope.raise("Unable to call an expression " + node.functionExpression.region + "  that is not of a function type.", Error.Level.Recoverable, "type", node.region)
}
addResolver("functionCall", resolve)
