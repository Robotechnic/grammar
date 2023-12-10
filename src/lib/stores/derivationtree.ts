import type { Rule } from "./grammar";
import { writable } from "svelte/store";
import { currentManipulationState } from "./manipulationState";

function createDerivationTreeStore() {
	const { subscribe, set, update } = writable<Rule[]>([]);
	return {
		subscribe,
		set,
		update,
		reset: () => set([]),
		restore: (rule: number) =>
			update((rules) => {
				currentManipulationState.set(rules[rule]);
				return rules.slice(0, rule + 1);
			}),
		addRule: (rule: Rule) => update((rules) => [...rules, rule]),
		removeRule: () =>
			update((rules) => {
				if (rules.length < 2) return rules;
				currentManipulationState.set(rules[rules.length - 2]);
				return rules.slice(0, -1);
			})
	};
}

export const derivationTree = createDerivationTreeStore();
