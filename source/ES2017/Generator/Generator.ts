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

import { Error, IO, Uri, Utilities } from "@cogneco/mend"
import * as ES from "../SyntaxTree"

export class Generator extends IO.Indenter {
	private lastNode: ES.Node | undefined
	private constructor(writer: IO.Writer, private readonly handler: Error.Handler) {
		super(writer)
	}
	raise(message: string) {
		this.handler.raise(message, Error.Level.Recoverable, "generator", this.lastNode ? this.lastNode.region : undefined)
	}
	async generate(node: ES.Node | Utilities.Enumerable<ES.Node>): Promise<boolean> {
		let result = false
		if (node instanceof ES.Node) {
			this.lastNode = node
			const generate = generators[node.class]
			if (!generate)
				this.raise("Unable to locate generator for " + node.class + ".")
			else if (!(result = await generate(this, node)))
				this.raise("Failed to generate output for " + JSON.stringify(node.serialize()) + ".")
		} else if (node instanceof Utilities.Enumerable) {
			const e = node.getEnumerator()
			let item: IteratorResult<ES.Node>
			result = true
			while (!(item = e.next()).done)
				result = await this.generate(item.value) && result
		}
		return result
	}
	create(name: string): Promise<Generator | undefined> {
		return Generator.create(this.resource.folder.appendPath(name), this.handler)
	}
	static async create(resource: Uri.Locator, handler: Error.Handler): Promise<Generator | undefined> {
		const writer = await IO.Writer.open(resource)
		return writer && new Generator(writer, handler) || Generator.create(resource.appendPath("index.c"), handler)
	}
}
const generators: { [className: string]: ((generator: Generator, node: ES.Node) => Promise<boolean>) } = {}
export function addGenerator<T extends ES.Node>(className: string, generate: (generator: Generator, node: T) => Promise<boolean>) {
	generators[className] = generate as (generator: Generator, node: ES.Node) => Promise<boolean>
}
