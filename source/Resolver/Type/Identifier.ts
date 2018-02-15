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

import * as SyntaxTree from "../../SyntaxTree"
import { Scope, addResolver } from "../Scope"

function resolve(identifier: SyntaxTree.Type.Identifier, scope: Scope): SyntaxTree.Type.Identifier {
	return new SyntaxTree.Type.Identifier(identifier.name, scope.resolve(identifier.parameters), scope.find(identifier.name), identifier)
}
addResolver("type.identifier", (statement: SyntaxTree.Statement, scope: Scope) => resolve(statement as SyntaxTree.Type.Identifier, scope))
