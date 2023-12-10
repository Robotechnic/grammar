import { writable } from "svelte/store";
import type { Rule } from "./grammar";

export const currentManipulationState = writable<Rule>([]);
