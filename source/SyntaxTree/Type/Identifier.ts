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
import * as Tokens from "../../Tokens"
import { Name } from "./Name"
import { TypeDeclaration } from "../TypeDeclaration"
import { addDeserializer, deserialize } from "../deserialize"
import { Node } from "../Node"

export class Identifier extends Name {
	get class() { return "type.identifier" }
	get parameters(): Utilities.Iterator<Identifier> {
		return new Utilities.ArrayIterator(this.parametersArray)
	}
	constructor(name: string, private parametersArray: Identifier[], readonly declaration?: TypeDeclaration, tokens?: Utilities.Iterable<Tokens.Substance> | Node) {
		super(name, tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			parameters: this.parametersArray.length > 0 ? this.parametersArray.map(t => t.serialize()) : undefined,
			declaration: this.declaration ? this.declaration.id : undefined,
		}
	}
}
addDeserializer("type.identifier", data => data.hasOwnProperty("name") ? new Identifier(data.name, deserialize<Identifier>(data.parameters as ({ class: string } & any)[] || [])) : undefined)
