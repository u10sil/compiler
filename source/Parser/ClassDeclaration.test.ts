// Copyright (C) 2015, 2017  Simon Mika <simon@mika.se>
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

import { Error } from "@cogneco/mend"
import * as SyntaxTree from "../SyntaxTree"
import * as Parser from "./"

function createDeclaration(sourceString: string, handler: Error.Handler): SyntaxTree.ClassDeclaration {
	return Parser.parseFirst(sourceString, handler) as SyntaxTree.ClassDeclaration
}

describe("Parser.ClassDeclaration", () => {
		const handler = new Error.ConsoleHandler()
		it("empty class", () => {
			const classDeclaration = createDeclaration("class Empty {}\n", handler)
			expect(classDeclaration).toBeTruthy()
			expect(classDeclaration.symbol).toEqual("Empty")
			expect(SyntaxTree.filterId(classDeclaration.serialize())).toEqual({ class: "classDeclaration", symbol: "Empty", content: [] })
		})
		it("generic class #1", () => {
			const classDeclaration = createDeclaration("class Empty<T> {}\n", handler)
			expect(classDeclaration).toBeTruthy()
			expect(classDeclaration.parameters.first!.name).toEqual("T")
			expect(SyntaxTree.filterId(classDeclaration.serialize())).toEqual({
				class: "classDeclaration", symbol: "Empty", parameters: [
					{ class: "type.name", name: "T" },
				],
				content: [],
			})
		})
		it("generic class #2", () => {
			const classDeclaration = createDeclaration("class Empty<T, S> {}\n", handler)
			expect(classDeclaration).toBeTruthy()
			const parameters = classDeclaration.parameters.getEnumerator()
			expect(parameters.fetch()!.name).toEqual("T")
			expect(parameters.fetch()!.name).toEqual("S")
			expect(SyntaxTree.filterId(classDeclaration.serialize())).toEqual({
				class: "classDeclaration", symbol: "Empty", parameters: [
					{ class: "type.name", name: "T" },
					{ class: "type.name", name: "S" },
				],
				content: [],
			})
		})
		it("class extends", () => {
			const classDeclaration = createDeclaration("class Empty extends Full {}\n", handler)
			expect(classDeclaration.extended!.name).toEqual("Full")
			expect(SyntaxTree.filterId(classDeclaration.serialize())).toEqual({ class: "classDeclaration", symbol: "Empty", extends: { class: "type.identifier", name: "Full" }, content: [] })
		})
		it("class implements", () => {
			const classDeclaration = createDeclaration("class Empty implements Enumerable, Enumerator {}\n", handler)
			const implemented = classDeclaration.implements.getEnumerator()
			expect(implemented.fetch()!.name).toEqual("Enumerable")
			expect(implemented.fetch()!.name).toEqual("Enumerator")
			expect(implemented.fetch()).toBeUndefined()
			expect(SyntaxTree.filterId(classDeclaration.serialize())).toEqual({
				class: "classDeclaration", symbol: "Empty", implements: [
					{ class: "type.identifier", name: "Enumerable" },
					{ class: "type.identifier", name: "Enumerator" },
				],
				content: [],
			})
		})
		it("generic class implements generic interfaces", () => {
			const classDeclaration = createDeclaration("class Empty<T, S> implements Interface1<T, S>, Interface2<T, S> {}\n", handler)
			const implemented = classDeclaration.implements.getEnumerator()
			const interface1 = implemented.fetch()!
			expect(interface1.name).toEqual("Interface1")
			const parameters1 = interface1.parameters.getEnumerator()
			expect(parameters1.fetch()!.name).toEqual("T")
			expect(parameters1.fetch()!.name).toEqual("S")
			expect(parameters1.fetch()).toBeUndefined()
			const interface2 = implemented.fetch()!
			expect(interface2.name).toEqual("Interface2")
			const parameters2 = interface2.parameters.getEnumerator()
			expect(parameters2.fetch()!.name).toEqual("T")
			expect(parameters2.fetch()!.name).toEqual("S")
			expect(parameters2.fetch()).toBeUndefined()
			expect(implemented.fetch()).toBeUndefined()
			expect(SyntaxTree.filterId(classDeclaration.serialize())).toEqual({
				class: "classDeclaration", symbol: "Empty",
				parameters: [{ class: "type.name", name: "T" }, { class: "type.name", name: "S" }],
				implements: [
					{ class: "type.identifier", name: "Interface1", parameters: [{ class: "type.identifier", name: "T" }, { class: "type.identifier", name: "S" }] },
					{ class: "type.identifier", name: "Interface2", parameters: [{ class: "type.identifier", name: "T" }, { class: "type.identifier", name: "S" }] },
				],
				content: [],
			})
		})
		it("abstract class", () => {
			const classDeclaration = createDeclaration("abstract class Empty {}\n", handler)
			expect(classDeclaration.isAbstract).toEqual(true)
			expect(SyntaxTree.filterUndefined(SyntaxTree.filterId(classDeclaration.serialize()))).toEqual({ class: "classDeclaration", symbol: "Empty", isAbstract: true, content: [] })
		})
		it("member fields", () => {
			const program: string =
`class Foobar {
var i: Int = 10
var f = 50.5
}
`
			const classDeclaration = createDeclaration(program, handler)
			const statements = classDeclaration.content.getEnumerator()
			const firstField = statements.fetch() as SyntaxTree.PropertyDeclaration
			expect(firstField.symbol).toEqual("i")
			expect((firstField.type as SyntaxTree.Type.Identifier).name).toEqual("Int")
			expect((firstField.value as SyntaxTree.Literal.Number).value).toEqual(10)
			const secondField = statements.fetch() as SyntaxTree.PropertyDeclaration
			expect(secondField.symbol).toEqual("f")
			expect(secondField.type).toBeUndefined()
			expect((secondField.value as SyntaxTree.Literal.Number).value).toEqual(50.5)
			expect(statements.fetch()).toBeUndefined()
			expect(SyntaxTree.filterId(classDeclaration.serialize())).toEqual({
				class: "classDeclaration", symbol: "Foobar", content: [
					{ class: "propertyDeclaration", symbol: "i", type: { class: "type.identifier", name: "Int"} , value: { class: "literal.number", value: 10 } },
					{ class: "propertyDeclaration", symbol: "f", value: { class: "literal.number", value: 50.5 } },
				],
			})
		})
		it("member functions", () => {
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
			const classDeclaration = createDeclaration(program, handler)
			const statements = classDeclaration.content.getEnumerator()
			const countField = statements.fetch() as SyntaxTree.PropertyDeclaration
			expect(countField.symbol).toEqual("count")
			const constructor = statements.fetch() as SyntaxTree.MethodDeclaration
			expect(constructor.symbol).toEqual("init")
			expect(constructor.body).toBeUndefined()
			expect(constructor.returnType).toBeUndefined()
			const updateCountFunction = statements.fetch() as SyntaxTree.MethodDeclaration
			expect(updateCountFunction.symbol).toEqual("updateCount")
			const updateCountArgument = updateCountFunction.arguments.first as SyntaxTree.ArgumentDeclaration
			expect(updateCountArgument.symbol).toEqual("newCount")
			expect((updateCountArgument.type as SyntaxTree.Type.Identifier).name).toEqual("Int")
			expect(updateCountFunction.returnType).toBeUndefined()
			const getCountFunction = statements.fetch() as SyntaxTree.MethodDeclaration
			expect(getCountFunction.symbol).toEqual("getCount")
			expect((getCountFunction.returnType as SyntaxTree.Type.Identifier).name).toEqual("Int")
			const getCountFunctionStatement = getCountFunction.body!.statements.first as SyntaxTree.Identifier
			expect(getCountFunctionStatement.name).toEqual("count")
			expect(SyntaxTree.filterUndefined(SyntaxTree.filterId(classDeclaration.serialize()))).toEqual({
				class: "classDeclaration", symbol: "Foobar", content: [
					{ class: "propertyDeclaration", symbol: "count", type: { class: "type.identifier", name: "Int" }, value: { class: "literal.number", value: 0 } },
					{ class: "methodDeclaration", symbol: "init" },
					{
						class: "methodDeclaration", symbol: "updateCount", arguments: [{ class: "argumentDeclaration", symbol: "newCount", type: { class: "type.identifier", name: "Int" } }], body: {
							class: "block", statements: [
								{ class: "infixOperator", symbol: "=", left: { class: "identifier", name: "count" }, right: { class: "identifier", name: "newCount" } },
							],
						},
					},
					{
						class: "methodDeclaration", symbol: "getCount", returnType: { class: "type.identifier", name: "Int" }, body: {
							class: "block", statements: [
								{ class: "identifier", name: "count" },
							],
						},
					},
				],
			})
		})
	})
