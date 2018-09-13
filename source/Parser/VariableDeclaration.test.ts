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

describe("Parser.VariableDeclaration", () => {
	const handler = new Error.ConsoleHandler()
	it("simple declaration", () => {
		const variableDeclaration = createDeclaration("var i: Int\n", handler)
		expect(variableDeclaration.symbol).toEqual("i")
		expect((variableDeclaration.type as SyntaxTree.Type.Identifier).name).toEqual("Int")
		expect(SyntaxTree.filterId(SyntaxTree.filterId(variableDeclaration.serialize()))).toEqual({ class: "variableDeclaration", symbol: "i", type: { class: "type.identifier", name: "Int"} })
	})
	it("static variable", () => {
		const variableDeclaration = createDeclaration("static var i: Int\n", handler)
		expect(variableDeclaration.symbol).toEqual("i")
		expect(variableDeclaration.isStatic).toBeTruthy()
		expect((variableDeclaration.type as SyntaxTree.Type.Identifier).name).toEqual("Int")
		expect(SyntaxTree.filterId(SyntaxTree.filterId(variableDeclaration.serialize()))).toEqual({ class: "variableDeclaration", isStatic: true, symbol: "i", type: { class: "type.identifier", name: "Int"} })
	})
	it("constant", () => {
		const variableDeclaration = createDeclaration("let i: Int\n", handler)
		expect(variableDeclaration.symbol).toEqual("i")
		expect(variableDeclaration.isConstant).toBeTruthy()
		expect((variableDeclaration.type as SyntaxTree.Type.Identifier).name).toEqual("Int")
		expect(SyntaxTree.filterId(SyntaxTree.filterId(variableDeclaration.serialize()))).toEqual({ class: "variableDeclaration", isConstant: true, symbol: "i", type: { class: "type.identifier", name: "Int"} })
	})
	it("static const", () => {
		const variableDeclaration = createDeclaration("static let i: Int\n", handler)
		expect(variableDeclaration.symbol).toEqual("i")
		expect(variableDeclaration.isStatic).toBeTruthy()
		expect(variableDeclaration.isConstant).toBeTruthy()
		expect((variableDeclaration.type as SyntaxTree.Type.Identifier).name).toEqual("Int")
		expect(SyntaxTree.filterId(SyntaxTree.filterId(variableDeclaration.serialize()))).toEqual({ class: "variableDeclaration", isStatic: true, isConstant: true, symbol: "i", type: { class: "type.identifier", name: "Int"} })
	})
	it("var a = b", () => {
		const variableDeclaration = Parser.parseFirst("var a = b", handler) as SyntaxTree.VariableDeclaration
		expect(variableDeclaration.symbol).toEqual("a")
		expect((variableDeclaration.value as SyntaxTree.Identifier).name).toEqual("b")
		expect(SyntaxTree.filterId(SyntaxTree.filterId(variableDeclaration.serialize()))).toEqual({ class: "variableDeclaration", symbol: "a", value: { class: "identifier", name: "b" } })
	})
	it("var foo: Type = bar", () => {
		const variableDeclaration = Parser.parseFirst("var foo: Type = bar", handler) as SyntaxTree.VariableDeclaration
		expect(variableDeclaration.symbol).toEqual("foo")
		expect((variableDeclaration.type as SyntaxTree.Type.Identifier).name).toEqual("Type")
		expect((variableDeclaration.value as SyntaxTree.Identifier).name).toEqual("bar")
		expect(SyntaxTree.filterId(SyntaxTree.filterId(variableDeclaration.serialize()))).toEqual({ class: "variableDeclaration", symbol: "foo", type: { class: "type.identifier", name: "Type"} , value: { class: "identifier", name: "bar" } })
	})
	it("var foo: Float = 0.50", () => {
		const variableDeclaration = Parser.parseFirst("var f: Float = 0.50", handler) as SyntaxTree.VariableDeclaration
		expect(variableDeclaration.symbol).toEqual("f")
		expect((variableDeclaration.type as SyntaxTree.Type.Identifier).name).toEqual("Float")
		expect((variableDeclaration.value as SyntaxTree.Literal.Number).value).toEqual(0.5)
		expect(SyntaxTree.filterId(SyntaxTree.filterId(variableDeclaration.serialize()))).toEqual({ class: "variableDeclaration", symbol: "f", type: { class: "type.identifier", name: "Float"} , value: { class: "literal.number", value: 0.5 } })
	})
})
function createDeclaration(sourceString: string, handler: Error.Handler): SyntaxTree.VariableDeclaration {
	return Parser.parseFirst(sourceString, handler) as SyntaxTree.VariableDeclaration
}
