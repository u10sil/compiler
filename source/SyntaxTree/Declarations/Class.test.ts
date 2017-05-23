// Copyright (C) 2015, 2017  Simon Mika <simon@mika.se>
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

import { Error, IO, Unit } from "@cogneco/mend"
import * as Tokens from "../../Tokens"
import * as SyntaxTree from "../"

import Is = Unit.Is
export class ClassTest extends Unit.Fixture {
	constructor() {
		super("SyntaxTree.Declarations.Class")
		const handler = new Error.ConsoleHandler()
		this.add("empty class", () => {
			const classDeclaration = this.createDeclaration("Empty: class {}\n", handler)
			this.expect(classDeclaration, Is.not.nullOrUndefined)
			this.expect(classDeclaration.symbol, Is.equal.to("Empty"))
		})
		this.add("generic class #1", () => {
			const classDeclaration = this.createDeclaration("Empty: class <T> {}\n", handler)
			this.expect(classDeclaration, Is.not.nullOrUndefined)
			this.expect(classDeclaration.typeParameters.next().name, Is.equal.to("T"))
		})
		this.add("generic class #2", () => {
			const classDeclaration = this.createDeclaration("Empty: class <T, S> {}\n", handler)
			this.expect(classDeclaration, Is.not.nullOrUndefined)
			const typeParameters = classDeclaration.typeParameters
			this.expect(typeParameters.next().name, Is.equal.to("T"))
			this.expect(typeParameters.next().name, Is.equal.to("S"))
		})
		this.add("class extends", () => {
			const classDeclaration = this.createDeclaration("Empty: class extends Full {}\n", handler)
			this.expect(classDeclaration.extended.name, Is.equal.to("Full"))
		})
		this.add("class implements", () => {
			const classDeclaration = this.createDeclaration("Empty: class implements Enumerable, Enumerator {}\n", handler)
			const implemented = classDeclaration.implemented
			this.expect(implemented.next().name, Is.equal.to("Enumerable"))
			this.expect(implemented.next().name, Is.equal.to("Enumerator"))
			this.expect(implemented.next(), Is.nullOrUndefined)
		})
		this.add("generic class implements generic interfaces", () => {
			const classDeclaration = this.createDeclaration("Empty: class <T, S> implements Interface1<T, S>, Interface2<T, S> {}\n", handler)
			const implemented = classDeclaration.implemented
			const interface1 = implemented.next()
			this.expect(interface1.name, Is.equal.to("Interface1"))
			const typeParameters1 = interface1.typeParameters
			this.expect(typeParameters1.next().name, Is.equal.to("T"))
			this.expect(typeParameters1.next().name, Is.equal.to("S"))
			this.expect(typeParameters1.next(), Is.nullOrUndefined)
			const interface2 = implemented.next()
			this.expect(interface2.name, Is.equal.to("Interface2"))
			const typeParameters2 = interface2.typeParameters
			this.expect(typeParameters2.next().name, Is.equal.to("T"))
			this.expect(typeParameters2.next().name, Is.equal.to("S"))
			this.expect(typeParameters2.next(), Is.nullOrUndefined)
			this.expect(implemented.next(), Is.nullOrUndefined)
		})
		this.add("abstract class", () => {
			const classDeclaration = this.createDeclaration("Empty: abstract class {}\n", handler)
			this.expect(classDeclaration.isAbstract, Is.true)
		})
		this.add("member fields", () => {
			const program: string =
`Foobar: class {
i: Int = 10
f := 50.5f
}
`
			const classDeclaration = this.createDeclaration(program, handler)
			const statements = classDeclaration.content.statements
			const firstField = statements.next() as SyntaxTree.Declarations.Assignment
			this.expect(firstField.left.name, Is.equal.to("i"))
			this.expect(firstField.type.name, Is.equal.to("Int"))
			this.expect((firstField.right as SyntaxTree.Expressions.Literal.Number).value, Is.equal.to(10))
			const secondField = statements.next() as SyntaxTree.Declarations.Assignment
			this.expect(secondField.left.name, Is.equal.to("f"))
			this.expect(secondField.type, Is.nullOrUndefined)
			this.expect((secondField.right as SyntaxTree.Expressions.Literal.Number).value, Is.equal.to(50.5))
			this.expect(statements.next(), Is.nullOrUndefined)
		})
		this.add("member functions", () => {
			const program: string =
`Foobar: class {
	count: Int = 0
	init: func
	updateCount: func (newCount: Int) {
		count = newCount
	}
	getCount: func -> Int {
		count
	}
}
`
			const classDeclaration = this.createDeclaration(program, handler)
			const statements = classDeclaration.content.statements
			const countField = statements.next()
			const constructor = statements.next() as SyntaxTree.Declarations.Function
			this.expect(constructor.symbol, Is.equal.to("init"))
			this.expect(constructor.body, Is.nullOrUndefined)
			this.expect(constructor.returnType, Is.nullOrUndefined)
			const updateCountFunction = statements.next() as SyntaxTree.Declarations.Function
			this.expect(updateCountFunction.symbol, Is.equal.to("updateCount"))
			const updateCountArgument = updateCountFunction.argumentList.next() as SyntaxTree.Declarations.Argument
			this.expect(updateCountArgument.symbol, Is.equal.to("newCount"))
			this.expect((updateCountArgument.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Int"))
			this.expect(updateCountFunction.returnType, Is.nullOrUndefined)
			const getCountFunction = statements.next() as SyntaxTree.Declarations.Function
			this.expect(getCountFunction.symbol, Is.equal.to("getCount"))
			this.expect((getCountFunction.returnType as SyntaxTree.Type.Identifier).name, Is.equal.to("Int"))
			const getCountFunctionStatement = getCountFunction.body.statements.next() as SyntaxTree.Expressions.Identifier
			this.expect(getCountFunctionStatement.name, Is.equal.to("count"))
		})
	}
	createDeclaration(sourceString: string, errorHandler: Error.Handler): SyntaxTree.Declarations.Class {
		const parser = new SyntaxTree.Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader(sourceString), errorHandler)), errorHandler)
		const statements = parser.next().statements
		return statements.next() as SyntaxTree.Declarations.Class
	}
}
Unit.Fixture.add(new ClassTest())
