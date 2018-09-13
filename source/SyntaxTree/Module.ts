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

import { Utilities } from "@cogneco/mend"
import * as Tokens from "../Tokens"
import { Statement } from "./Statement"
import { Node } from "./Node"
import { addDeserializer, deserialize } from "./deserialize"

export class Module extends Node {
	get class() { return "module" }
	constructor(readonly name: string, readonly statements: Utilities.Enumerable<Statement>, tokens?: Utilities.Enumerable<Tokens.Substance> | Node) {
		super(tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			name: this.name,
			statements: this.statements.map(s => s.serialize()).toArray(),
		}
	}
}
addDeserializer("module", data => data.hasOwnProperty("name") && data.hasOwnProperty("statements") ? new Module(data.name, deserialize<Statement>(data.statements as Utilities.Enumerable<{ class: string } & any>)) : undefined)
