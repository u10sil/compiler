// Copyright (C) 2017, 2018  Simon Mika <simon@mika.se>
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

import * as SyntaxTree from "../SyntaxTree"
import { Scope, addResolver } from "./Scope"

function resolve(scope: Scope, node: SyntaxTree.Identifier) {
	const result = scope.findSymbol(node)
	if (result != undefined) {
		scope.addDeclaration(node, result)
		const declaration = SyntaxTree.Node.locate(result)
		if (declaration)
			scope.setType(node, scope.getType(declaration))
	} else
		scope.raise("Unable to resolve symbol \"" + node.name + "\" at " + node.region + ".")
}
addResolver("identifier", resolve)
