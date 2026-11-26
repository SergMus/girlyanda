export function createFormData(fields: Readonly<Record<string, string | Blob>>): FormData {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    data.set(key, value);
  }

  return data;
}

export function field(data: FormData, name: string): string {
  const value = data.get(name);

  return typeof value === 'string' ? value.trim() : '';
}
