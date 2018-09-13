// Copyright (C) 2017, 2018  Simon Mika <simon@mika.se>
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

import * as SyntaxTree from "../SyntaxTree"

export class Declarations {
	constructor(private readonly backend: { [id: number]: number | undefined }) { }
	get(node: number | SyntaxTree.Node): SyntaxTree.Node | undefined {
		const id = this.backend[node instanceof SyntaxTree.Node ? node.id : node]
		return id != undefined ? SyntaxTree.Node.locate(id) : undefined
	}
	patch(node: { id: number } & any): { id: number } & any
	patch(nodes: ({ id: number } & any)[]): ({ id: number } & any)[]
	patch(node: { id: number } & any | ({ id: number } & any)[] | any): { id: number } & any | ({ id: number } & any)[] {
		return SyntaxTree.map(node, n => {
			const declaration = this.get(n.id)
			if (declaration)
				n.declaration = declaration.id
			return n
		})
	}
}
