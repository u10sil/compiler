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

import { Utilities } from "@cogneco/mend"
import * as Tokens from "../../Tokens"
import { addDeserializer } from "../deserialize"
import { Node } from "../Node"
import { Identifier } from "./Identifier"
import { NumberCategory } from "./NumberCategory"
import { Expression } from "./Expression"

export class Primitive extends Identifier {
	readonly size: number
	readonly category: NumberCategory
	get class() { return "type.primitive" }
	constructor(name: string, tokens?: Utilities.Enumerable<Tokens.Substance> | Node) {
		super(name, Utilities.Enumerable.empty, tokens)
		switch (name[0]) {
			case "f":
				this.category = NumberCategory.float
				break
			case "s":
				this.category = NumberCategory.signed
				break
			default:
			case "u":
				this.category = NumberCategory.unsigned
				break
		}
		this.size = Number.parseInt(name.slice(1))
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
		}
	}
	static getType(value: number): Expression {
/*
		let result: Expression = new Intersection(new Primitive("f32"), new Primitive("f64"))
		if (Number.isInteger(value)) {
			if (value < 0) {
				let base = 64
				while (base >= 8 && value >= -Math.pow(2, base - 1)) {
					result = new Intersection(result, new Primitive("s" + base))
					base = base / 2
				}
			} else {
				let base = 64
				while (base >= 8 && value < Math.pow(2, base - 1)) {
					result = new Intersection(result, new Primitive("s" + base))
					if (value < Math.pow(2, base - 1))
						result = new Intersection(result, new Primitive("u" + base))
					base = base / 2
				}
			}
		}
		return result
 */
		let result: Expression | undefined
		if (Number.isInteger(value)) {
			if (value < 0) {
				let base = 64
				while (base >= 8 && value >= -Math.pow(2, base - 1)) {
					result = new Primitive("s" + base)
					base = base / 2
				}
			} else {
				let base = 64
				while (base >= 8 && value < Math.pow(2, base - 1)) {
					result = new Primitive("s" + base)
					if (value < Math.pow(2, base - 1))
						result = new Primitive("u" + base)
					base = base / 2
				}
			}
		} else
			result = new Primitive("f64")
		return result ? result : new Primitive("s32")
	}
}
addDeserializer("type.primitive", data => data.hasOwnProperty("name") ? new Primitive(data.name) : undefined)
