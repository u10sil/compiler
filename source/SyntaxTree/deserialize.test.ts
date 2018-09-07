// Copyright (C) 2017  Simon Mika <simon@mika.se>
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

import { deserialize } from "./"
import { filterId } from "./filterId"

describe("SyntaxTree.deserialize", () => {
	it("'b'", () => {
		const data = { class: "literal.character", value: "b" }
		const node = deserialize(data)
		expect(node).toBeTruthy()
		expect(filterId(node!.serialize())).toEqual(data)
	})
	it("a = 'b'", () => {
		const data = {
			class: "infixOperator",
			symbol: "=",
			left: { class: "identifier", name: "a" },
			right: { class: "literal.character", value: "b" },
		}
		const node = deserialize(data)
		expect(node).toBeTruthy()
		expect(filterId(node!.serialize())).toEqual(data)
	})
	it("argument declarations", () => {
		const data = [
				{ class: "argumentDeclaration", symbol: "a" },
				{ class: "argumentDeclaration", symbol: "b", type: { class: "type.identifier", name: "Generic", parameters: [{ class: "type.identifier", name: "T" }] } },
				{ class: "argumentDeclaration", symbol: "x" },
				{ class: "argumentDeclaration", symbol: "y", type: { class: "type.identifier", name: "Generic", parameters: [{ class: "type.identifier", name: "S" }] } },
			]
		const nodes = deserialize(data)
		expect(nodes).toBeTruthy()
		expect(nodes.length).toEqual(4)
		const enumerator = nodes.getEnumerator()
		for (let i = 0; i < 4; i++)
			expect(filterId(enumerator.next().value.serialize())).toEqual(data[i])
	})
	it("empty function", () => {
		const data = {
			class: "functionDeclaration", symbol: "empty",
			parameters: [
				{ class: "type.name", name: "T" },
				{ class: "type.name", name: "S" },
			],
			arguments: [
				{ class: "argumentDeclaration", symbol: "a" },
				{ class: "argumentDeclaration", symbol: "b", type: { class: "type.identifier", name: "Generic", parameters: [{ class: "type.identifier", name: "T" }] } },
				{ class: "argumentDeclaration", symbol: "x" },
				{ class: "argumentDeclaration", symbol: "y", type: { class: "type.identifier", name: "Generic", parameters: [{ class: "type.identifier", name: "S" }] } },
			],
		}
		const node = deserialize(data)
		expect(node).toBeTruthy()
		expect(filterId(node!.serialize())).toEqual(data)
	})
})
