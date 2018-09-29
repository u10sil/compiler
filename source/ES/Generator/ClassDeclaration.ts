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
import { addGenerator } from "./Generator"

addGenerator<SyntaxTree.ClassDeclaration>("classDeclaration",
	async (generator, node) => {
		let notFirst = false
		return await generator.write("class ") &&
			await generator.write(node.symbol) &&
			(node.extends ? await generator.write(" extends ") && await generator.generate(node.extends) : true) &&
			(node.implements && node.implements.length > 0 ? await generator.write(" implements ") && node.implements.map(async item => (notFirst = !notFirst || await generator.write(", ")) && generator.generate(item)).reduce((r, item) => item && r, true) : true) &&
			await generator.writeLine(" {") &&
			generator.increase() &&
			await generator.generate(node.declarations) &&
			generator.decrease() &&
			generator.writeLine("}")
	},
)
