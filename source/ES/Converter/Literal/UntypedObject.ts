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

import * as SyntaxTree from "../../../SyntaxTree"
import * as ES from "../../SyntaxTree"
import { addConverter } from "../Converter"

addConverter<SyntaxTree.Literal.UntypedObject>("literal.untypedObject",
	(converter, node) => {
		const value: { [ property: string ]: ES.Expression } = {}
		for (const property in node.value)
			if (node.value.hasOwnProperty(property))
				value[property] = converter.convert(node.value[property])
		return new ES.Literal.Objekt(value, node.tokens)
	},
)
