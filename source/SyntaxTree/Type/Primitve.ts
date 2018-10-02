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

import { Utilities } from "@cogneco/mend"
import * as Tokens from "../../Tokens"
import { addDeserializer } from "../deserialize"
import { Node } from "../Node"
import { Identifier } from "./Identifier"

export class Primitive extends Identifier {
	get class() { return "type.primitive" }
	constructor(name: string, tokens?: Utilities.Enumerable<Tokens.Substance> | Node) {
		super(name, Utilities.Enumerable.empty, tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
		}
	}
	static readonly number = new Primitive("number")
	static readonly string = new Primitive("string")
	static readonly boolean = new Primitive("boolean")
}
addDeserializer("type.primitive", data => data.hasOwnProperty("name") ? new Primitive(data.name) : undefined)
