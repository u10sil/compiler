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

import { Error, Utilities } from "@cogneco/mend"
import * as Tokens from "../Tokens"

export abstract class Node {
	abstract get class(): string
	readonly id: number
	private regionCache: Error.Region | undefined
	get region(): Error.Region | undefined {
		if (!this.regionCache)
			this.regionCache = (this.tokens ? this.tokens.map(item => item.region || null).reduce((result: Error.Region | null, region: Error.Region | null) => region != null ? result != null ? result.merge(region) : region : result, null) : null) || undefined
		return this.regionCache
	}
	readonly tokens?: Utilities.Enumerable<Tokens.Substance>
	constructor(tokens?: Utilities.Enumerable<Tokens.Substance> | Node) {
		if (tokens instanceof Node) {
			this.id = tokens.id
			this.tokens = tokens.tokens
		} else {
			this.id = nodeCount++
			this.tokens = tokens
		}
		Node.nodes[this.id] = this
	}
	serialize(): { class: string } & any {
		return { id: this.id, class: this.class }
	}
	private static nodes: { [id: number]: Node } = {}
	static locate(id: number): Node | undefined {
		return Node.nodes[id]
	}
}
let nodeCount = 0
