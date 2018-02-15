// Copyright (C) 2015, 2017  Simon Mika <simon@mika.se>
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

import { Utilities } from "@cogneco/mend"
import * as Tokens from "../Tokens"

export type Iterator<T> = Utilities.Iterator<T>
export abstract class Node {
	abstract get class(): string
	readonly id: number
	readonly tokens?: Utilities.Iterable<Tokens.Substance>
	constructor(tokens?: Utilities.Iterable<Tokens.Substance> | Node) {
		if (tokens instanceof Node) {
			this.id = tokens.id
			this.tokens = tokens.tokens
		} else {
			this.id = nodeCount++
			this.tokens = tokens
		}
	}
	serialize(): { class: string } & any {
		return { id: this.id, class: this.class }
	}
}
let nodeCount = 0
