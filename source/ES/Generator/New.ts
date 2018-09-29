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

import * as SyntaxTree from "../SyntaxTree"
import { Generator, addGenerator } from "./Generator"
import { Utilities } from "@cogneco/mend"

addGenerator<SyntaxTree.New>("New", async (generator, node) =>
		await generator.write("new ") &&
		await generator.generate(node.name) &&
		await generator.write("(") &&
		await generateArguments(generator, node.arguments) &&
		generator.write(")"),
)
async function generateArguments(generator: Generator, argumentExpressions: Utilities.Enumerable<SyntaxTree.Expression>): Promise<boolean> {
let result = true
let notFirst = false
for (const expression of argumentExpressions)
	if (!(result = (notFirst = !notFirst || await generator.write(", ")) && await generator.generate(expression)))
		break
return result
}
