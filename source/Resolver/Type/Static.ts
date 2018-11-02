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

import * as SyntaxTree from "../../SyntaxTree"
import { Scope, addMemberFinder } from "../Scope"

function find(scope: Scope, parent: SyntaxTree.Type.Static, member: SyntaxTree.Identifier): number | undefined {
	let result: number | undefined
	const parentType = scope.findType(parent.argument)
	if (parentType)
		result = scope.findMember(member, parentType, true)
	return result
}
addMemberFinder("type.static", find)