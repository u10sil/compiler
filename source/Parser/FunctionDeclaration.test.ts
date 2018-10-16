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

describe("Parser.FunctionDeclaration", () => {
	const handler = new Error.ConsoleHandler()
	//
	// TODO: Construct a test for an argument list with no explicitly set types (type inference)
	//
	it("empty function", () => {
		const functionDeclaration = createDeclaration("func empty\n", handler)
		expect(functionDeclaration.symbol).toEqual("empty")
		expect(SyntaxTree.filterId(functionDeclaration.serialize())).toEqual({ class: "functionDeclaration", symbol: "empty" })
	})
	it("empty function with parameters", () => {
		const functionDeclaration = createDeclaration("func empty(i: Int, j: Float, k: Double)\n", handler)
		const functionArguments = functionDeclaration.arguments.getEnumerator()
		let currentArgument: SyntaxTree.ArgumentDeclaration
		expect(functionDeclaration.symbol).toEqual("empty")
		currentArgument = functionArguments.fetch()!
		expect(currentArgument.symbol).toEqual("i")
		expect((currentArgument.type as SyntaxTree.Type.Identifier).name).toEqual("Int")
		currentArgument = functionArguments.fetch()!
		expect(currentArgument.symbol).toEqual("j")
		expect((currentArgument.type as SyntaxTree.Type.Identifier).name).toEqual("Float")
		currentArgument = functionArguments.fetch()!
		expect(currentArgument.symbol).toEqual("k")
		expect((currentArgument.type as SyntaxTree.Type.Identifier).name).toEqual("Double")
		expect(SyntaxTree.filterId(functionDeclaration.serialize())).toEqual({ class: "functionDeclaration", symbol: "empty", arguments: [
			{ class: "argumentDeclaration", symbol: "i", type: { class: "type.identifier", name: "Int" } },
			{ class: "argumentDeclaration", symbol: "j", type: { class: "type.identifier", name: "Float" } },
			{ class: "argumentDeclaration", symbol: "k", type: { class: "type.identifier", name: "Double" } },
		] })
	})
	it("empty function with interfered argument types", () => {
		const functionDeclaration = createDeclaration("func empty(w, h: Int, x, y, z: Float)\n", handler)
		const functionArguments = functionDeclaration.arguments.getEnumerator()
		let currentArgument: SyntaxTree.ArgumentDeclaration
		expect(functionDeclaration.symbol).toEqual("empty")
		currentArgument = functionArguments.fetch()!
		expect(currentArgument.symbol).toEqual("w")
		expect(currentArgument.type).toBeUndefined()
		currentArgument = functionArguments.fetch()!
		expect(currentArgument.symbol).toEqual("h")
		expect((currentArgument.type as SyntaxTree.Type.Identifier).name).toEqual("Int")
		currentArgument = functionArguments.fetch()!
		expect(currentArgument.symbol).toEqual("x")
		expect(currentArgument.type).toBeUndefined()
		currentArgument = functionArguments.fetch()!
		expect(currentArgument.symbol).toEqual("y")
		expect(currentArgument.type).toBeUndefined()
		currentArgument = functionArguments.fetch()!
		expect(currentArgument.symbol).toEqual("z")
		expect((currentArgument.type as SyntaxTree.Type.Identifier).name).toEqual("Float")
		expect(SyntaxTree.filterId(functionDeclaration.serialize())).toEqual({ class: "functionDeclaration", symbol: "empty", arguments: [
			{ class: "argumentDeclaration", symbol: "w" },
			{ class: "argumentDeclaration", symbol: "h", type: { class: "type.identifier", name: "Int" } },
			{ class: "argumentDeclaration", symbol: "x" },
			{ class: "argumentDeclaration", symbol: "y" },
			{ class: "argumentDeclaration", symbol: "z", type: { class: "type.identifier", name: "Float" } },
		] })
	})
	it("empty generic function with generic parameter types", () => {
		const functionDeclaration = createDeclaration("func empty<T, S>(a, b: Generic<T>, x, y: Generic<S>)\n", handler)
		const parameters = functionDeclaration.parameters.getEnumerator()
		expect(parameters.fetch()!.name).toEqual("T")
		expect(parameters.fetch()!.name).toEqual("S")
		const functionArguments = functionDeclaration.arguments.getEnumerator()
		let currentArgument = functionArguments.fetch()! // a
		expect(currentArgument.type).toBeUndefined()
		currentArgument = functionArguments.fetch()! // b
		expect((currentArgument.type as SyntaxTree.Type.Identifier).parameters.first!.name).toEqual("T")
		currentArgument = functionArguments.fetch()! // x
		expect(currentArgument.type).toBeUndefined()
		currentArgument = functionArguments.fetch()! // y
		expect((currentArgument.type as SyntaxTree.Type.Identifier).parameters.first!.name).toEqual("S")
		expect(SyntaxTree.filterId(functionDeclaration.serialize())).toEqual({
			class: "functionDeclaration", symbol: "empty",
			parameters: [
				{ class: "type.name", name: "T" },
				{ class: "type.name", name: "S" },
			],
			arguments: [
			{ class: "argumentDeclaration", symbol: "a" },
			{ class: "argumentDeclaration", symbol: "b", type: { class: "type.identifier", name: "Generic", parameters: [{ class: "type.identifier", name: "T" }]} },
			{ class: "argumentDeclaration", symbol: "x" },
			{ class: "argumentDeclaration", symbol: "y", type: { class: "type.identifier", name: "Generic", parameters: [{ class: "type.identifier", name: "S" }] } },
		] })
	})
	it("empty function with return type", () => {
		const functionDeclaration = createDeclaration("func empty -> ReturnType\n", handler)
		expect(functionDeclaration.symbol).toEqual("empty")
		expect((functionDeclaration.returnType as SyntaxTree.Type.Identifier).name).toEqual("ReturnType")
		expect(SyntaxTree.filterId(functionDeclaration.serialize())).toEqual({ class: "functionDeclaration", symbol: "empty", returnType: { class: "type.identifier", name: "ReturnType" } })
	})
	it("empty function with return type tuple", () => {
		const functionDeclaration = createDeclaration("func empty -> (Int, Float, Double)\n", handler)
		const tupleChildren = (functionDeclaration.returnType as SyntaxTree.Type.Tuple).elements.getEnumerator()
		expect(functionDeclaration.symbol).toEqual("empty")
		expect((tupleChildren.fetch() as SyntaxTree.Type.Identifier).name).toEqual("Int")
		expect((tupleChildren.fetch() as SyntaxTree.Type.Identifier).name).toEqual("Float")
		expect((tupleChildren.fetch() as SyntaxTree.Type.Identifier).name).toEqual("Double")
		expect(SyntaxTree.filterId(functionDeclaration.serialize())).toEqual({
			class: "functionDeclaration", symbol: "empty", returnType: {
				class: "type.tuple",
				elements: [
					{ class: "type.identifier", name: "Int" },
					{ class: "type.identifier", name: "Float" },
					{ class: "type.identifier", name: "Double" },
				],
			},
		})
	})
})
function createDeclaration(sourceString: string, handler: Error.Handler): SyntaxTree.FunctionDeclaration {
	return Parser.parseFirst(sourceString, handler) as SyntaxTree.FunctionDeclaration
}
