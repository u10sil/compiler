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
import { Declaration } from "./Declaration"
import * as Type from "./Type"
import { addDeserializer, deserialize } from "./deserialize"

export class ArgumentDeclaration extends Declaration {
	constructor(symbol: string, readonly type?: Type.Expression | undefined, tokens?: () => Utilities.Iterator<Tokens.Substance>) {
		super(symbol, tokens)
	}
	serialize(): { class: string } & any {
		return {
			...super.serialize(),
			class: "argumentDeclaration",
			type: this.type && this.type.serialize(),
		}
	}
}
addDeserializer("argumentDeclaration", data => data.hasOwnProperty("symbol") ? new ArgumentDeclaration(data.symbol, deserialize(data.type)) : undefined)
