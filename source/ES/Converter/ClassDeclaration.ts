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

import { Utilities } from "@cogneco/mend"
import * as SyntaxTree from "../../SyntaxTree"
import * as ES from "../SyntaxTree"
import { Converter, addConverter } from "./Converter"

export function* convertDeclarations(converter: Converter, statements: Utilities.Enumerable<SyntaxTree.Statement>): Iterable<ES.Statement> {
	const iterator = statements.getEnumerator()
	let next = iterator.next()
	while (!next.done) {
		let result = converter.convert(next.value)
		next = iterator.next()
		if (next.done)
			result = new ES.ReturnStatement(result)
		yield result
	}
}
addConverter<SyntaxTree.ClassDeclaration>("classDeclaration",
	(converter, node) => new ES.ClassDeclaration(
		node.symbol,
		node.isAbstract,
		converter.convert(node.parameters),
		node.extended ? converter.convert(node.extended) as ES.Type.Identifier : undefined,
		converter.convert(node.implements),
		Utilities.Enumerable.from(convertDeclarations(converter, node.content ? node.content.statements : Utilities.Enumerable.empty)),
		node.tokens),
)
