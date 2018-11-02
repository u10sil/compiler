// Copyright (C) 2017  Simon Mika <simon@mika.se>
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

import { Error, Utilities } from "@cogneco/mend"
import { Scope } from "./Scope"
import { Declarations } from "./Declarations"
import { Types } from "./Types"
import * as SyntaxTree from "../SyntaxTree"

function resolve(handler: Error.Handler, statement: SyntaxTree.Statement | Utilities.Enumerable<SyntaxTree.Statement> | Utilities.Enumerable<SyntaxTree.Module>): [Declarations, Types] {
	const scope = Scope.create(handler)
	scope.resolve(statement)
	return [scope.declarations, scope.types]
}

export {
	resolve,
	Declarations,
	Types,
}

import "./Literal"
import "./Type"
import "./ArgumentDeclaration"
import "./Block"
import "./ClassDeclaration"
import "./FunctionCall"
import "./FunctionDeclaration"
import "./Identifier"
import "./InfixOperator"
import "./LambdaOperator"
import "./MethodDeclaration"
import "./Module"
import "./PropertyDeclaration"
import "./ResolvingOperator"
import "./ThisDeclaration"
import "./Tuple"
import "./UnaryOperator"
import "./VariableDeclaration"
