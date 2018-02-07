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

import { Scope } from "./Scope"
import * as SyntaxTree from "../SyntaxTree"

export function resolve(module: SyntaxTree.Module): SyntaxTree.Module
export function resolve(statement: SyntaxTree.Statement): SyntaxTree.Statement {
	return Scope.empty.resolve(statement)
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
import "./Module"
import "./PostfixOperator"
import "./PrefixOperator"
import "./Tuple"
import "./VariableDeclaration"
