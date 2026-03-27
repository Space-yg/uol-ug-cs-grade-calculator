export default class BetterMap<K, V> {
	obj: [K, V][]

	constructor()
	constructor(obj: [K, V][])
	constructor(keys: K[], values: V[])
	constructor(keysOrObj?: K[] | [K, V][], values?: V[]) {
		if (keysOrObj) {
			if (values) {
				if (keysOrObj.length !== values.length) throw new Error("Keys and values must have equal number of elements.")

				this.obj = (keysOrObj as K[]).map((key, idx) => [key, values[idx]])
			} else {
				this.obj = keysOrObj as [K, V][]
			}
		} else {
			this.obj = []
		}
	}

	get(key: K): V | undefined
	get(key: K, defaultValue: V): V
	get(key: K, defaultValue?: V): V | undefined {
		return this.obj.find(([k, v]) => k === key)?.[1] ?? defaultValue
	}

	set(key: K, value: V): this {
		this.obj.push([key, value])
		return this
	}

	keys(): K[] {
		return this.obj.map((([key, value]) => key))
	}

	values(): V[] {
		return this.obj.map((([key, value]) => value))
	}

	entires(): [K, V][] {
		return this.obj
	}

	forEach(callbackfn: (value: V, key: K, map: this) => void, thisArg?: any): void {
		this.obj.forEach(([k, v], idx, arr) => callbackfn(v, k, this), thisArg)
	}

	mapValues<U>(callbackfn: (key: K, value: V, map: this) => U, thisArg?: any): BetterMap<K, U>
	mapValues<U>(callbackfn: (key: K, value: V, map: this) => U, thisArg?: any, inPlace?: false): BetterMap<K, U>
	mapValues(callbackfn: (key: K, value: V, map: this) => V, thisArg: any, inPlace: true): this
	mapValues<U>(callbackfn: ((key: K, value: V, map: this) => U) | ((key: K, value: V, map: this) => V), thisArg?: any, inPlace?: boolean): BetterMap<K, U> | BetterMap<K, V> {
		if (inPlace) {
			this.forEach((v, k) => this.set(k, (callbackfn as (key: K, value: V, map: this) => V)(k, v, this)), thisArg)
			return this
		} else {
			const newMap = new BetterMap<K, U>()
			this.forEach((v, k) => newMap.set(k, (callbackfn as (key: K, value: V, map: this) => U)(k, v, this)), thisArg)
			return newMap
		}
	}

	reduceValues(callbackfn: (previousValue: V, currentValue: V, map: this) => V): V
	reduceValues(callbackfn: (previousValue: V, currentValue: V, map: this) => V, initialValue: V): V
	reduceValues<U>(callbackfn: (previousValue: U, currentValue: V, map: this) => U, initialValue: U): U
	reduceValues<U>(callbackfn: ((previousValue: V, currentValue: V, map: this) => V) | ((previousValue: U, currentValue: V, map: this) => U), initialValue?: U): V | U {
		if (typeof initialValue !== "undefined") return this.obj.reduce((prev, [currKey, currValue], idx, arr) => (callbackfn as (previousValue: U, currentValue: V, map: this) => U)(prev, currValue, this), initialValue as U)
		else return [...this.values()].reduce((prevValue, currValue, idx, arr) => (callbackfn as (previousValue: V, currentValue: V, map: this) => V)(prevValue, currValue, this))
	}

	reduceKeys(callbackfn: (previousKey: K, currentKey: K, map: this) => K): K
	reduceKeys(callbackfn: (previousKey: K, currentKey: K, map: this) => K, initialValue: K): K
	reduceKeys<L>(callbackfn: (previousKey: L, currentKey: K, map: this) => L, initialValue: L): L
	reduceKeys<L>(callbackfn: ((previousKey: K, currentKey: K, map: this) => K) | ((previousKey: L, currentKey: K, map: this) => L), initialValue?: L): K | L {
		if (typeof initialValue !== "undefined") return this.obj.reduce((prev, [currKey, currValue], idx, arr) => (callbackfn as (previousKey: L, currentKey: K, map: this) => L)(prev, currKey, this), initialValue as L)
		else return [...this.keys()].reduce((prevValue, currValue, idx, arr) => (callbackfn as (previousKey: K, currentKey: K, map: this) => K)(prevValue, currValue, this))
	}

	filter(predicate: (key: K, value: V, map: this) => unknown, thisArg?: any): BetterMap<K, V> {
		return new BetterMap(this.obj.filter(([k, v]) => predicate(k, v, this)))
	}
}