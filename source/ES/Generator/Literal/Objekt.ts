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

import * as SyntaxTree from "../../SyntaxTree"
import { Generator, addGenerator } from "../Generator"

addGenerator<SyntaxTree.Literal.Objekt>("Literal.Object", async (generator, node) =>
	await generator.writeLine("{") &&
	generator.increase() &&
	await generateValue(generator, node.value) &&
	generator.decrease() &&
	generator.write("}"),
)
async function generateValue(generator: Generator, value: { [ property: string ]: SyntaxTree.Expression }): Promise<boolean> {
	let result = true
	for (const property in value)
		if (result && value.hasOwnProperty(property))
			result = await generator.write(property) && await generator.write(": ") && await generator.generate(value[property]) && await generator.writeLine(",")
	return result
}
