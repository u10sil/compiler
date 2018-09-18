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

export function map<T>(node: any, mapping: (node: { id: number } & any) => { id: number } & any): any
export function map<T>(node: { id: number } & any | any, mapping: (node: { id: number } & any) => { id: number } & any): T
export function map<T>(nodes: ({ id: number } & any)[], mapping: (node: { id: number } & any) => { id: number } & any): T[]
export function map<T>(node: { id: number } & any | ({ id: number } & any)[] | any, mapping: (node: { id: number } & any) => { id: number } & any): T | T[] | any {
	if (node && node.hasOwnProperty("id")) {
		node = mapping(node)
		for (const key in node)
			if (node.hasOwnProperty(key))
				node[key] = map(node[key], mapping)
	}	else if (node instanceof Array)
		for (const index in node)
			node[index] = map(node[index], mapping)
	else if (typeof node == "object")
		for (const key in node)
			if (node.hasOwnProperty(key))
				node[key] = map(node[key], mapping)
	return node
}
