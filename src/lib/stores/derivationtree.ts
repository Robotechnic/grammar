import type { Rule } from "./grammar";
import { writable } from "svelte/store";

function createDerivationTreeStore() {
	const { subscribe, set, update } = writable<Rule[]>([]);
	return {
		subscribe,
		set,
		update,
		reset: () => set([]),
		restore: (rule: number) => update((rules) => rules.slice(0, rule)),
		addRule: (rule: Rule) => update((rules) => [...rules, rule]),
		removeRule: () => update((rules) => rules.slice(0, -1))
	};
}

export const derivationTree = createDerivationTreeStore();
