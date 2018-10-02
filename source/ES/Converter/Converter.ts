// Copyright (C) 2018  Simon Mika <simon@mika.se>
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

import { Error, Utilities } from "@cogneco/mend"
import * as SyntaxTree from "../../SyntaxTree"
import * as Resolver from "../../Resolver"
import * as ES from "../SyntaxTree"

export class Converter {
	constructor(readonly declarations: Resolver.Declarations, readonly types: Resolver.Types, readonly handler: Error.Handler) {
	}
	getType(node: SyntaxTree.Node): ES.Type.Expression {
		const result = this.types.get(node)
		if (!result)
			this.handler.raise("No type available.", Error.Level.Recoverable, "converter", node.region)
		return result ? this.convert(result) : ES.Type.Primitive.void
	}
	getReturnType(node: SyntaxTree.Node): ES.Type.Expression {
		let result = this.types.get(node)
		if (!(result instanceof SyntaxTree.Type.Function)) {
			this.handler.raise("Function does not have a function type.", Error.Level.Recoverable, "converter", node.region)
			result = undefined
		} else {
			result = result.result
			if (!result)
				this.handler.raise("No return type available.", Error.Level.Recoverable, "converter", node.region)
		}
		return result ? this.convert(result) : ES.Type.Primitive.void
	}
	convert(node: SyntaxTree.Node): ES.Node
	convert(node: SyntaxTree.Expression): ES.Expression
	convert(nodes: SyntaxTree.Type.Identifier): ES.Type.Identifier
	convert(nodes: Utilities.Enumerable<SyntaxTree.Type.Identifier>): Utilities.Enumerable<ES.Type.Identifier>
	convert(nodes: SyntaxTree.Type.Name): ES.Type.Name
	convert(nodes: Utilities.Enumerable<SyntaxTree.Type.Name>): Utilities.Enumerable<ES.Type.Name>
	convert(node: SyntaxTree.Type.Expression): ES.Type.Expression
	convert(nodes: SyntaxTree.Declaration): ES.Declaration
	convert(nodes: Utilities.Enumerable<SyntaxTree.ArgumentDeclaration>): Utilities.Enumerable<ES.ArgumentDeclaration>
	convert(nodes: Utilities.Enumerable<SyntaxTree.Declaration>): Utilities.Enumerable<ES.Declaration>
	convert(nodes: Utilities.Enumerable<SyntaxTree.Node>): Utilities.Enumerable<ES.Node>
	convert(node: SyntaxTree.Node | Utilities.Enumerable<SyntaxTree.Node>): ES.Node | Utilities.Enumerable<ES.Node> {
		let result: ES.Node | Utilities.Enumerable<ES.Node>
		if (node instanceof SyntaxTree.Node) {
			const converter = converters[node.class]
			if (!converter)
				this.handler.raise("Missing converter to convert \"" + node.class + "\" to ES.")
			result = converter && converter(this, node)
		} else
			result = node.map(n => this.convert(n))
		return result
	}
	static convert(nodes: Utilities.Enumerable<SyntaxTree.Node>, declarations: Resolver.Declarations, types: Resolver.Types, handler: Error.Handler): Utilities.Enumerable<ES.Node> {
		return new Converter(declarations, types, handler).convert(nodes)
	}
}
const converters: { [className: string]: ((converter: Converter, node: SyntaxTree.Node) => ES.Node)} = {}
export function addConverter<T extends SyntaxTree.Node>(className: string, convert: (converter: Converter, node: T) => ES.Node) {
	converters[className] = (converter, node) => convert(converter, node as T)
}
