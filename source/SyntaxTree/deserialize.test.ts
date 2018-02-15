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

import { Unit } from "@cogneco/mend"
import { deserialize } from "./deserialize"
import { filterId } from "./filterId"

import Is = Unit.Is
class DeserializeTest extends Unit.Fixture {
	constructor() {
		super("SyntaxTree.deserialize")
		this.add("'b'", () => {
			const data = { class: "literal.character", value: "b" }
			const node = deserialize(data)
			this.expect(node, Is.not.nullOrUndefined)
			this.expect(filterId(node!.serialize()), Is.equal.to(data))
		})
		this.add("a = 'b'", () => {
			const data = {
				class: "infixOperator",
				symbol: "=",
				left: { class: "identifier", name: "a" },
				right: { class: "literal.character", value: "b" },
			}
			const node = deserialize(data)
			this.expect(node, Is.not.nullOrUndefined)
			this.expect(filterId(node!.serialize()), Is.equal.to(data))
		})
		this.add("argument declarations", () => {
			const data = [
					{ class: "argumentDeclaration", symbol: "a" },
					{ class: "argumentDeclaration", symbol: "b", type: { class: "type.identifier", name: "Generic", parameters: [{ class: "type.identifier", name: "T" }] } },
					{ class: "argumentDeclaration", symbol: "x" },
					{ class: "argumentDeclaration", symbol: "y", type: { class: "type.identifier", name: "Generic", parameters: [{ class: "type.identifier", name: "S" }] } },
				]
			const nodes = deserialize(data)
			this.expect(nodes, Is.not.nullOrUndefined)
			this.expect(nodes.length, Is.equal.to(4))
			for (let i = 0; i < 4; i++)
				this.expect(filterId(nodes[i].serialize()), Is.equal.to(data[i]))
		})
		this.add("empty function", () => {
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
			this.expect(node, Is.not.nullOrUndefined)
			this.expect(filterId(node!.serialize()), Is.equal.to(data))
		})
	}
}
Unit.Fixture.add(new DeserializeTest())
