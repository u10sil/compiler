// Copyright (C) 2018  Simon Mika <simon@mika.se>
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

import { Error, Utilities } from "@cogneco/mend"
import * as SyntaxTree from "../../../SyntaxTree"
import * as Resolver from "../../../Resolver"
import * as C99 from "../SyntaxTree"
import { convert, addConverter } from "./convert"

function* convertBody(statements: Utilities.Enumerable<SyntaxTree.Statement>, declarations: Resolver.Declarations, types: Resolver.Types, handler: Error.Handler): Iterable<C99.Statement> {
	const iterator = statements.getEnumerator()
	let next = iterator.next()
	while (!next.done) {
		let result = convert(next.value, declarations, types, handler)
		next = iterator.next()
		if (next.done)
			result = new C99.ReturnStatement(result)
		yield result
	}
}
addConverter<SyntaxTree.FunctionDeclaration>("functionDeclaration",
	(node, declarations, types, handler) => new C99.FunctionDeclaration(node.symbol, convert(node.arguments, declarations, types, handler), Utilities.Enumerable.from(convertBody(node.body ? node.body.statements : Utilities.Enumerable.empty, declarations, types, handler)), node.tokens),
)
