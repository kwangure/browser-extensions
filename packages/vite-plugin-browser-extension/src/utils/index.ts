export function Ok<T>(value: T) {
	return { ok: true as const, value };
}

export function Err<T extends string>(type: T, error: Error) {
	return { ok: false as const, type, error };
}

export function parseJson<T = unknown>(source: string) {
	try {
		return Ok(JSON.parse(source) as T);
	} catch (error) {
		Object.assign(error as object, { source });
		return Err('parse-json', error as Error & { source: string });
	}
}
