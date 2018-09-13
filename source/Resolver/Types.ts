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

export class Types {
	constructor(private readonly backend: { [id: number]: SyntaxTree.Type.Expression }) { }
	get(node: number | SyntaxTree.Node): SyntaxTree.Type.Expression | undefined {
		return this.backend[node instanceof SyntaxTree.Node ? node.id : node]
	}
	patch(node: { id: number } & any): { id: number } & any
	patch(nodes: ({ id: number } & any)[]): ({ id: number } & any)[]
	patch(node: { id: number } & any | ({ id: number } & any)[] | any): { id: number } & any | ({ id: number } & any)[] {
		return SyntaxTree.map(node, n => {
			const type = this.get(n.id)
			if (type)
				n.type = type.toString()
			return n
		})
	}
}
