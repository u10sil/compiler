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

import { Node } from "./Node"

const deserializers: ((data: { class: string } & any) => Node | undefined)[] = []
export function addDeserializer(deserializer: (data: { class: string } & any) => Node | undefined) {
	deserializers.push(deserializer)
}
export function deserialize<T extends Node>(data: ({ class: string } & any)[]): T[]
export function deserialize<T extends Node>(data: { class: string } & any): T | undefined
export function deserialize<T extends Node>(data: ({ class: string } & any)[] | { class: string } & any): T[] | T | undefined {
	return data instanceof Array ? deserializeArray<T>(data) : deserializeNode(data) as T | undefined
}
function deserializeArray<T>(data: ({ class: string } & any)[]): T[] {
	return data.map(node => deserializeNode(node) as T | undefined).filter(node => !node) as T[]
}
function deserializeNode(data: { class: string } & any): Node | undefined {
	let result: Node | undefined
	if (deserializers.length > 0) {
		let i = 0
		do
			result = deserializers[i++](data)
		while (!result && i < deserializers.length)
	}
	return result
}
