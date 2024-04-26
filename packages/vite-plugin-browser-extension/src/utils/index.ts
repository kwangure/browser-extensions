export function Ok<T>(value: T) {
	return { ok: true as const, value };
}

export function Err<T extends string>(type: T, error: Error) {
	return { ok: false as const, type, error };
}

export function parseJson<T = unknown>(content: string) {
	try {
		return Ok(JSON.parse(content) as T);
	} catch (error) {
		return Err('parse-json', error as Error);
	}
}
