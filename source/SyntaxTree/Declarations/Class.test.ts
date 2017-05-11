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
		var handler = new Error.ConsoleHandler()
		this.add("empty class", () => {
			var classDeclaration = this.createDeclaration("Empty: class {}\n", handler)
			this.expect(classDeclaration, Is.Not().NullOrUndefined())
			this.expect(classDeclaration.getSymbol(), Is.Equal().To("Empty"))
		})
		this.add("generic class #1", () => {
			var classDeclaration = this.createDeclaration("Empty: class <T> {}\n", handler)
			this.expect(classDeclaration, Is.Not().NullOrUndefined())
			this.expect(classDeclaration.getTypeParameters().next().getName(), Is.Equal().To("T"))
		})
		this.add("generic class #2", () => {
			var classDeclaration = this.createDeclaration("Empty: class <T, S> {}\n", handler)
			this.expect(classDeclaration, Is.Not().NullOrUndefined())
			var typeParameters = classDeclaration.getTypeParameters()
			this.expect(typeParameters.next().getName(), Is.Equal().To("T"))
			this.expect(typeParameters.next().getName(), Is.Equal().To("S"))
		})
		this.add("class extends", () => {
			var classDeclaration = this.createDeclaration("Empty: class extends Full {}\n", handler)
			this.expect(classDeclaration.getExtended().getName(), Is.Equal().To("Full"))
		})
		this.add("class implements", () => {
			var classDeclaration = this.createDeclaration("Empty: class implements Enumerable, Enumerator {}\n", handler)
			var implemented = classDeclaration.getImplemented()
			this.expect(implemented.next().getName(), Is.Equal().To("Enumerable"))
			this.expect(implemented.next().getName(), Is.Equal().To("Enumerator"))
			this.expect(implemented.next(), Is.NullOrUndefined())
		})
		this.add("generic class implements generic interfaces", () => {
			var classDeclaration = this.createDeclaration("Empty: class <T, S> implements Interface1<T, S>, Interface2<T, S> {}\n", handler)
			var implemented = classDeclaration.getImplemented()
			var interface1 = implemented.next()
			this.expect(interface1.getName(), Is.Equal().To("Interface1"))
			var typeParameters1 = interface1.getTypeParameters()
			this.expect(typeParameters1.next().getName(), Is.Equal().To("T"))
			this.expect(typeParameters1.next().getName(), Is.Equal().To("S"))
			this.expect(typeParameters1.next(), Is.NullOrUndefined())
			var interface2 = implemented.next()
			this.expect(interface2.getName(), Is.Equal().To("Interface2"))
			var typeParameters2 = interface2.getTypeParameters()
			this.expect(typeParameters2.next().getName(), Is.Equal().To("T"))
			this.expect(typeParameters2.next().getName(), Is.Equal().To("S"))
			this.expect(typeParameters2.next(), Is.NullOrUndefined())
			this.expect(implemented.next(), Is.NullOrUndefined())
		})
		this.add("abstract class", () => {
			var classDeclaration = this.createDeclaration("Empty: abstract class {}\n", handler)
			this.expect(classDeclaration.isAbstract(), Is.True())
		})
		this.add("member fields", () => {
			var program: string =
`Foobar: class {
i: Int = 10
f := 50.5f
}
`
			var classDeclaration = this.createDeclaration(program, handler);
			var statements = classDeclaration.getBlock().getStatements()
			var firstField = <SyntaxTree.Declarations.Assignment>statements.next()
			this.expect(firstField.getLeft().getName(), Is.Equal().To("i"))
			this.expect(firstField.getType().getName(), Is.Equal().To("Int"))
			this.expect((<SyntaxTree.Expressions.Literal.Number>firstField.getRight()).getValue(), Is.Equal().To(10))
			var secondField = <SyntaxTree.Declarations.Assignment>statements.next()
			this.expect(secondField.getLeft().getName(), Is.Equal().To("f"))
			this.expect(secondField.getType(), Is.NullOrUndefined())
			this.expect((<SyntaxTree.Expressions.Literal.Number>secondField.getRight()).getValue(), Is.Equal().To(50.5))
			this.expect(statements.next(), Is.NullOrUndefined())
		})
		this.add("member functions", () => {
			var program: string =
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
			var classDeclaration = this.createDeclaration(program, handler);
			var statements = classDeclaration.getBlock().getStatements()
			var countField = statements.next()
			var constructor = <SyntaxTree.Declarations.Function>statements.next()
			this.expect(constructor.getSymbol(), Is.Equal().To("init"))
			this.expect(constructor.getBody(), Is.NullOrUndefined())
			this.expect(constructor.getReturnType(), Is.NullOrUndefined())
			var updateCountFunction = <SyntaxTree.Declarations.Function>statements.next()
			this.expect(updateCountFunction.getSymbol(), Is.Equal().To("updateCount"))
			var updateCountArgument = <SyntaxTree.Declarations.Argument>updateCountFunction.getArguments().next()
			this.expect(updateCountArgument.getSymbol(), Is.Equal().To("newCount"))
			this.expect((<SyntaxTree.Type.Identifier>updateCountArgument.getType()).getName(), Is.Equal().To("Int"))
			this.expect(updateCountFunction.getReturnType(), Is.NullOrUndefined())
			var getCountFunction = <SyntaxTree.Declarations.Function>statements.next()
			this.expect(getCountFunction.getSymbol(), Is.Equal().To("getCount"))
			this.expect((<SyntaxTree.Type.Identifier>getCountFunction.getReturnType()).getName(), Is.Equal().To("Int"))
			var getCountFunctionStatement = <SyntaxTree.Expressions.Identifier>getCountFunction.getBody().getStatements().next()
			this.expect(getCountFunctionStatement.getName(), Is.Equal().To("count"))
		})
	}
	createDeclaration(sourceString: string, errorHandler: Error.Handler): SyntaxTree.Declarations.Class {
		var parser = new SyntaxTree.Parser(new Tokens.GapRemover(new Tokens.Lexer(new IO.StringReader(sourceString), errorHandler)), errorHandler)
		var statements = parser.next().getStatements()
		return <SyntaxTree.Declarations.Class> statements.next()
	}
}
Unit.Fixture.add(new ClassTest())
