// Copyright (C) 2018  Simon Mika <simon@mika.se>
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

import { Error, Utilities } from "@cogneco/mend"
import * as SyntaxTree from "../../SyntaxTree"
import * as Tokens from "../../Tokens"
import { ArgumentDeclaration } from "./ArgumentDeclaration"

export abstract class Node {
	abstract get class(): string
	readonly id: number
	private regionCache: Error.Region | undefined
	get region(): Error.Region | undefined {
		if (!this.regionCache)
			this.regionCache = (this.tokens ? this.tokens.map(item => item.region || null).reduce((result: Error.Region | null, region: Error.Region | null) => region != null && result != null ? result.merge(region) : region, null) : null) || undefined
		return this.regionCache
	}
	constructor(readonly tokens?: Utilities.Enumerable<Tokens.Substance>) {
		this.id = nodeCount++
	}
	serialize(): { class: string } & any {
		return { id: this.id, class: this.class }
	}
	private static converters: { [className: string]: ((node: SyntaxTree.Node) => Node)} = {}
	static addConverter<T extends SyntaxTree.Node>(className: string, converter: (node: T) => Node) {
		Node.converters[className] = node => converter(node as T)
	}
	static convert(node: SyntaxTree.Node): Node
	static convert(nodes: Utilities.Enumerable<SyntaxTree.ArgumentDeclaration>): Utilities.Enumerable<ArgumentDeclaration>
	static convert(nodes: Utilities.Enumerable<SyntaxTree.Node>): Utilities.Enumerable<Node>
	static convert(node: SyntaxTree.Node | Utilities.Enumerable<SyntaxTree.Node>): Node | Utilities.Enumerable<Node> {
		let result: Node | Utilities.Enumerable<Node>
		if (node instanceof SyntaxTree.Node) {
			const converter = Node.converters[node.class]
			result = converter && converter(node)
		} else
			result = node.map(n => Node.convert(n))
		return result
	}
}
let nodeCount = 0
