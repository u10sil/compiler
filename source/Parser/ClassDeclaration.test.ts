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

import { Error, Unit } from "@cogneco/mend"
import * as SyntaxTree from "../SyntaxTree"
import * as Parser from "./"

import Is = Unit.Is
export class ClassDeclarationTest extends Unit.Fixture {
	constructor() {
		super("Parser.ClassDeclaration")
		const handler = new Error.ConsoleHandler()
		this.add("empty class", () => {
			const classDeclaration = this.createDeclaration("class Empty {}\n", handler)
			this.expect(classDeclaration, Is.not.nullOrUndefined)
			this.expect(classDeclaration.symbol, Is.equal.to("Empty"))
			this.expect(classDeclaration.serialize(), Is.equal.to({ class: "classDeclaration", symbol: "Empty", content: { class: "block" } }))
		})
		this.add("generic class #1", () => {
			const classDeclaration = this.createDeclaration("class Empty<T> {}\n", handler)
			this.expect(classDeclaration, Is.not.nullOrUndefined)
			this.expect(classDeclaration.parameters.next()!.name, Is.equal.to("T"))
			this.expect(classDeclaration.serialize(), Is.equal.to({
				class: "classDeclaration", symbol: "Empty", parameters: [
					{ class: "type.name", name: "T" },
				],
				content: { class: "block" },
			}))
		})
		this.add("generic class #2", () => {
			const classDeclaration = this.createDeclaration("class Empty<T, S> {}\n", handler)
			this.expect(classDeclaration, Is.not.nullOrUndefined)
			const parameters = classDeclaration.parameters
			this.expect(parameters.next()!.name, Is.equal.to("T"))
			this.expect(parameters.next()!.name, Is.equal.to("S"))
			this.expect(classDeclaration.serialize(), Is.equal.to({
				class: "classDeclaration", symbol: "Empty", parameters: [
					{ class: "type.name", name: "T" },
					{ class: "type.name", name: "S" },
				],
				content: { class: "block" },
			}))
		})
		this.add("class extends", () => {
			const classDeclaration = this.createDeclaration("class Empty extends Full {}\n", handler)
			this.expect(classDeclaration.extended!.name, Is.equal.to("Full"))
			this.expect(classDeclaration.serialize(), Is.equal.to({ class: "classDeclaration", symbol: "Empty", extends: { class: "type.identifier", name: "Full" }, content: { class: "block" } }))
		})
		this.add("class implements", () => {
			const classDeclaration = this.createDeclaration("class Empty implements Enumerable, Enumerator {}\n", handler)
			const implemented = classDeclaration.implemented
			this.expect(implemented.next()!.name, Is.equal.to("Enumerable"))
			this.expect(implemented.next()!.name, Is.equal.to("Enumerator"))
			this.expect(implemented.next(), Is.nullOrUndefined)
			this.expect(classDeclaration.serialize(), Is.equal.to({
				class: "classDeclaration", symbol: "Empty", implements: [
					{ class: "type.identifier", name: "Enumerable" },
					{ class: "type.identifier", name: "Enumerator" },
				],
				content: { class: "block" },
			}))
		})
		this.add("generic class implements generic interfaces", () => {
			const classDeclaration = this.createDeclaration("class Empty<T, S> implements Interface1<T, S>, Interface2<T, S> {}\n", handler)
			const implemented = classDeclaration.implemented
			const interface1 = implemented.next()!
			this.expect(interface1.name, Is.equal.to("Interface1"))
			const parameters1 = interface1.parameters
			this.expect(parameters1.next()!.name, Is.equal.to("T"))
			this.expect(parameters1.next()!.name, Is.equal.to("S"))
			this.expect(parameters1.next(), Is.nullOrUndefined)
			const interface2 = implemented.next()!
			this.expect(interface2.name, Is.equal.to("Interface2"))
			const parameters2 = interface2.parameters
			this.expect(parameters2.next()!.name, Is.equal.to("T"))
			this.expect(parameters2.next()!.name, Is.equal.to("S"))
			this.expect(parameters2.next(), Is.nullOrUndefined)
			this.expect(implemented.next(), Is.nullOrUndefined)
			this.expect(classDeclaration.serialize(), Is.equal.to({
				class: "classDeclaration", symbol: "Empty",
				parameters: [{ class: "type.name", name: "T" }, { class: "type.name", name: "S" }],
				implements: [
					{ class: "type.identifier", name: "Interface1", parameters: [{ class: "type.identifier", name: "T" }, { class: "type.identifier", name: "S" }] },
					{ class: "type.identifier", name: "Interface2", parameters: [{ class: "type.identifier", name: "T" }, { class: "type.identifier", name: "S" }] },
				],
				content: { class: "block" },
			}))
		})
		this.add("abstract class", () => {
			const classDeclaration = this.createDeclaration("abstract class Empty {}\n", handler)
			this.expect(classDeclaration.isAbstract, Is.true)
			this.expect(classDeclaration.serialize(), Is.equal.to({ class: "classDeclaration", symbol: "Empty", isAbstract: true, content: { class: "block" } }))
		})
		this.add("member fields", () => {
			const program: string =
`class Foobar {
var i: Int = 10
var f = 50.5
}
`
			const classDeclaration = this.createDeclaration(program, handler)
			const statements = classDeclaration.content.statements
			const firstField = statements.next() as SyntaxTree.VariableDeclaration
			this.expect(firstField.symbol, Is.equal.to("i"))
			this.expect((firstField.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Int"))
			this.expect((firstField.value as SyntaxTree.Literal.Number).value, Is.equal.to(10))
			const secondField = statements.next() as SyntaxTree.VariableDeclaration
			this.expect(secondField.symbol, Is.equal.to("f"))
			this.expect(secondField.type, Is.nullOrUndefined)
			this.expect((secondField.value as SyntaxTree.Literal.Number).value, Is.equal.to(50.5))
			this.expect(statements.next(), Is.nullOrUndefined)
			this.expect(classDeclaration.serialize(), Is.equal.to({
				class: "classDeclaration", symbol: "Foobar", content: {
					class: "block",
					statements: [
						{ class: "variableDeclaration", symbol: "i", type: { class: "type.identifier", name: "Int"} , value: { class: "literal.number", value: 10 } },
						{ class: "variableDeclaration", symbol: "f", value: { class: "literal.number", value: 50.5 } },
					],
				},
			}))
		})
		this.add("member functions", () => {
			const program: string =
`class Foobar {
	var count: Int = 0
	func init
	func updateCount(newCount: Int) {
		count = newCount
	}
	func getCount -> Int {
		count
	}
}
`
			const classDeclaration = this.createDeclaration(program, handler)
			const statements = classDeclaration.content.statements
			const countField = statements.next() as SyntaxTree.VariableDeclaration
			this.expect(countField.symbol, Is.equal.to("count"))
			const constructor = statements.next() as SyntaxTree.FunctionDeclaration
			this.expect(constructor.symbol, Is.equal.to("init"))
			this.expect(constructor.body, Is.nullOrUndefined)
			this.expect(constructor.returnType, Is.nullOrUndefined)
			const updateCountFunction = statements.next() as SyntaxTree.FunctionDeclaration
			this.expect(updateCountFunction.symbol, Is.equal.to("updateCount"))
			const updateCountArgument = updateCountFunction.argumentList.next() as SyntaxTree.ArgumentDeclaration
			this.expect(updateCountArgument.symbol, Is.equal.to("newCount"))
			this.expect((updateCountArgument.type as SyntaxTree.Type.Identifier).name, Is.equal.to("Int"))
			this.expect(updateCountFunction.returnType, Is.nullOrUndefined)
			const getCountFunction = statements.next() as SyntaxTree.FunctionDeclaration
			this.expect(getCountFunction.symbol, Is.equal.to("getCount"))
			this.expect((getCountFunction.returnType as SyntaxTree.Type.Identifier).name, Is.equal.to("Int"))
			const getCountFunctionStatement = getCountFunction.body!.statements.next() as SyntaxTree.Identifier
			this.expect(getCountFunctionStatement.name, Is.equal.to("count"))
			this.expect(classDeclaration.serialize(), Is.equal.to({
				class: "classDeclaration", symbol: "Foobar", content: {
					class: "block",
					statements: [
						{ class: "variableDeclaration", symbol: "count", type: { class: "type.identifier", name: "Int" }, value: { class: "literal.number", value: 0 } },
						{ class: "functionDeclaration", symbol: "init" },
						{
							class: "functionDeclaration", symbol: "updateCount", arguments: [{ class: "argumentDeclaration", symbol: "newCount", type: { class: "type.identifier", name: "Int" } }], body: {
								class: "block", statements: [
									{ class: "infixOperator", symbol: "=", left: { class: "identifier", name: "count" }, right: { class: "identifier", name: "newCount" } },
								],
							},
						},
						{
							class: "functionDeclaration", symbol: "getCount", returnType: { class: "type.identifier", name: "Int" }, body: {
								class: "block", statements: [
									{ class: "identifier", name: "count" },
								],
							},
						},
					],
				},
			}))
		})
	}
	createDeclaration(sourceString: string, handler: Error.Handler): SyntaxTree.ClassDeclaration {
		return Parser.parseFirst(sourceString, handler) as SyntaxTree.ClassDeclaration
	}
}
Unit.Fixture.add(new ClassDeclarationTest())
