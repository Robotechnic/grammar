import { writable } from "svelte/store"

export type Grammar = {
	productions: Map<string, string[]>,
	start: string
}

function createGrammarStore() {
	const {subscribe, set, update} = writable<Grammar>({
		productions: new Map<string, string[]>(),
		start: ""
	})

	return {
		subscribe,
		set,
		update,
		reset: () => set({
			productions: new Map<string, string[]>(),
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
			grammar.productions.set(variable, production)
			return grammar
		})
	}
}

export const grammar = createGrammarStore()