// Copyright (C) 2018 Simon Mika <simon@mika.se>
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

import * as SyntaxTree from "../SyntaxTree"
import { Scope, addResolver } from "./Scope"

function resolve(declaration: SyntaxTree.ClassDeclaration, scope: Scope): SyntaxTree.ClassDeclaration {
	scope = scope.create()
	// scope.add("this", this) // TODO: Add this and This to scope
	return new SyntaxTree.ClassDeclaration(declaration.symbol, declaration.isAbstract, scope.resolve(declaration.parameters), scope.resolve(declaration.extended), scope.resolve(declaration.implemented), scope.resolve(declaration.content), declaration.tokens)
}
addResolver("functionCall", (expression, scope) => resolve(expression as SyntaxTree.ClassDeclaration, scope))
