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
import * as Resolver from "../../Resolver"
import * as C99 from "../SyntaxTree"

export class Converter {
	constructor(readonly declarations: Resolver.Declarations, readonly types: Resolver.Types, readonly handler: Error.Handler) {
	}
	getType(node: SyntaxTree.Node): C99.Type.Expression {
		const result = this.types.get(node)
		return result ? this.convert(result) : C99.Type.Primitive.void
	}
	convert(node: SyntaxTree.Node): C99.Node
	convert(node: SyntaxTree.Type.Expression): C99.Type.Expression
	convert(nodes: Utilities.Enumerable<SyntaxTree.ArgumentDeclaration>): Utilities.Enumerable<C99.ArgumentDeclaration>
	convert(nodes: Utilities.Enumerable<SyntaxTree.Node>): Utilities.Enumerable<C99.Node>
	convert(node: SyntaxTree.Node | Utilities.Enumerable<SyntaxTree.Node>): C99.Node | Utilities.Enumerable<C99.Node> {
		let result: C99.Node | Utilities.Enumerable<C99.Node>
		if (node instanceof SyntaxTree.Node) {
			const converter = converters[node.class]
			result = converter && converter(this, node)
		} else
			result = node.map(n => this.convert(n))
		return result
	}
	static convert(nodes: Utilities.Enumerable<SyntaxTree.Node>, declarations: Resolver.Declarations, types: Resolver.Types, handler: Error.Handler): Utilities.Enumerable<C99.Node> {
		return new Converter(declarations, types, handler).convert(nodes)
	}
}
const converters: { [className: string]: ((converter: Converter, node: SyntaxTree.Node) => C99.Node)} = {}
export function addConverter<T extends SyntaxTree.Node>(className: string, convert: (converter: Converter, node: T) => C99.Node) {
	converters[className] = (converter, node) => convert(converter, node as T)
}
