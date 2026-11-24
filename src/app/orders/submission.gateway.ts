import { Injectable } from '@angular/core';
import { CartItem } from './cart.store';

export interface InstallationRequest {
  readonly name: string;
  readonly phone: string;
  readonly objectType: string;
  readonly description: string;
  readonly photo: File | null;
}

export class InstallationSubmissionError extends Error {
  constructor(readonly status: number) {
    super('Installation request failed');
  }
}

export interface OrderRequest {
  readonly name: string;
  readonly phone: string;
  readonly city: string;
  readonly delivery: string;
  readonly lines: readonly CartItem[];
}

@Injectable({providedIn: 'root'})
export class SubmissionGateway {
  async sendInstallation({name, phone, objectType, description, photo}: InstallationRequest): Promise<string> {
    const body = new FormData();
    body.set('name', name);
    body.set('phone', phone);
    body.set('objectType', objectType);
    body.set('description', description);
    if (photo) body.set('photo', photo);

    const response = await fetch('/api/installation', {method: 'POST', body, signal: AbortSignal.timeout(35_000)});
    if (!response.ok) throw new InstallationSubmissionError(response.status);
    const {id} = await response.json() as {id?: unknown};
    if (typeof id !== 'string' || !/^[A-F0-9]{8}$/.test(id)) throw new Error('Invalid installation receipt');
    return id;
  }

  async sendOrder(payload: OrderRequest): Promise<string> {
    const database = await new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open('girlyanda-preview', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('submissions', {keyPath: 'id'});
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('Preview storage is blocked'));
      request.onsuccess = () => resolve(request.result);
    });

    const id = crypto.randomUUID();
    try {
      await new Promise<void>((resolve, reject) => {
        const operation = database.transaction('submissions', 'readwrite');
        operation.oncomplete = () => resolve();
        operation.onabort = () => reject(operation.error);
        operation.onerror = () => reject(operation.error);
        operation.objectStore('submissions').add({id, type: 'order', payload, createdAt: new Date().toISOString()});
      });
      return id.slice(0, 8).toUpperCase();
    } finally {
      database.close();
    }
  }
}

export function field(data: FormData, name: string): string {
  const value = data.get(name);
  return typeof value === 'string' ? value.trim() : '';
}
