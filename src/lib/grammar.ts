import { writable } from "svelte/store"

export type Terminal = string | null
export type Variable = { letter: string, index: number }

export type Rule = (Terminal | Variable)[]

export type Grammar = {
	productions: Map<string, Rule[]>
	start: string
}


/**
 * Convert the given list of rules into production rules list
 * @param grammar The current grammar used
 * @param production The list of productions rules
 * @return Rule[] the parsed production rules
 */
function parseProduction(grammar: Grammar, production: string[]) {
	let result: Rule[] = []
	production.forEach(rule => {
		let parsedRule: Rule = []
		rule.split("").forEach((letter, index) => {
			if (grammar.productions.has(letter)) {
				parsedRule.push({
					letter,
					index
				} as Variable)
			} else if (letter == "ε") {
				parsedRule.push(null)
			} else {
				parsedRule.push(letter)
			}
		})
		result.push(parsedRule)
	})
	return result
}

function updateProduction(grammar: Grammar, variable: string) {
	grammar.productions.forEach((rules) => {
		rules.forEach((rule) => {
			rule.forEach((element, index) => {
				if (typeof element == "string" && element == variable) {
					rule[index] = {
						letter: variable,
						index
					} as Variable
				}
			})
		})
	})
}

function createGrammarStore() {
	const { subscribe, set, update } = writable<Grammar>({
		productions: new Map<string, Rule[]>(),
		start: ""
	})

	return {
		subscribe,
		set,
		update,
		reset: () => set({
			productions: new Map<string, Rule[]>(),
			start: ""
		}),
		addVariable: (variable: string) => update(grammar => {
			grammar.productions.set(variable, [])
			return grammar
		}),
		removeVariable: (variable: string) => update(grammar => {
			grammar.productions.delete(variable)
			return grammar
		}),
		setProduction: (variable: string, production: string[]) => update(grammar => {
			grammar.productions.set(variable, parseProduction(grammar, production))
			updateProduction(grammar, variable)
			return grammar
		}),
		setStart: (start: string) => update(grammar => {
			grammar.start = start
			return grammar
		})
	}
}

export const grammar = createGrammarStore()
export function ruleToString(rule: Rule) {
	return rule.map((element) => {
		if (element === null) {
			return "ε"
		} else if (typeof element == "string") {
			return element
		} else {
			return element.letter
		}
	}).join("")
} 