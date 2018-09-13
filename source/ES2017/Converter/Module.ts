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
import * as ES from "../SyntaxTree"
import { addConverter } from "./Converter"
import { Utilities } from "@cogneco/mend"

addConverter<SyntaxTree.Module>("module",
	(converter, node) => {
		const declarations: ES.Declaration[] = []
		const mainBody: ES.Statement[] = []
		const iterator = node.statements.getEnumerator()
		let next: IteratorResult<SyntaxTree.Statement>
		while (!(next = iterator.next()).done)
			if (next.value instanceof SyntaxTree.VariableDeclaration && !next.value.noAssignment) {
				const declaration = converter.convert(next.value) as ES.VariableDeclaration
				declarations.push(declaration.declaration)
				const assignment = declaration.assignment
				if (assignment)
					mainBody.push(assignment)
			} else if (next.value instanceof SyntaxTree.Declaration)
				declarations.push(converter.convert(next.value as SyntaxTree.Declaration) as ES.Declaration)
			else {
				let statement = converter.convert(next.value)
				if (!(statement instanceof ES.Statement))
					statement = new ES.ExpressionStatement(statement)
				mainBody.push(statement)
			}
		if (mainBody.length > 0) {
			const last = mainBody[mainBody.length - 1]
			let returnType: ES.Type.Expression
			if (last instanceof ES.ExpressionStatement) {
				mainBody[mainBody.length - 1] = new ES.ReturnStatement(last.expression)
				returnType = new ES.Type.Primitive("int")
			} else
				returnType = new ES.Type.Primitive("void")
			declarations.push(new ES.FunctionDeclaration("main", Utilities.Enumerable.empty, returnType, Utilities.Enumerable.from(mainBody), node.tokens))
		}
		return new ES.Module(node.name, Utilities.Enumerable.from(declarations), node.tokens)
	},
)
