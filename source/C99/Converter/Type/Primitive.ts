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

import { Error } from "@cogneco/mend"

import * as SyntaxTree from "../../../SyntaxTree"
import * as C99 from "../../SyntaxTree"
import { addConverter } from "../Converter"

addConverter<SyntaxTree.Type.Primitive>("type.primitive",
	(converter, node) => {
		let result: C99.Type.Expression
		switch (node.name) {
			case "s8":
				result = new C99.Type.Primitive("char", node.tokens)
				break
			case "u8":
				result = new C99.Type.Primitive("unsigned char", node.tokens)
				break
			case "s16":
				result = new C99.Type.Primitive("short", node.tokens)
				break
			case "u16":
				result = new C99.Type.Primitive("unsigned short", node.tokens)
				break
			case "s32":
				result = new C99.Type.Primitive("long", node.tokens)
				break
			case "u32":
				result = new C99.Type.Primitive("unsigned long", node.tokens)
				break
			case "s64":
				result = new C99.Type.Primitive("long long", node.tokens)
				break
			case "u64":
				result = new C99.Type.Primitive("unsigned long long", node.tokens)
				break
			case "f32":
				result = new C99.Type.Primitive("float", node.tokens)
				break
			case "f64":
				result = new C99.Type.Primitive("double", node.tokens)
				break
			case "f80":
				result = new C99.Type.Primitive("long double", node.tokens)
				break
			case "string":
				result = new C99.Type.Primitive("char*", node.tokens)
				break
			default:
				converter.handler.raise("Type " + node.toString() + " does not have a corresponding C99 type.", Error.Level.Recoverable, "C99", node.region)
				result = new C99.Type.Primitive("unkown", node.tokens)
				break
		}
		return result
	},
)
