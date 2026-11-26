import { Injectable } from '@angular/core';
import { createFormData } from '../shared/form-data';
import type { CartItem } from './cart-data';

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

@Injectable({ providedIn: 'root' })
export class SubmissionGateway {
  async sendInstallation({ name, phone, objectType, description, photo }: InstallationRequest): Promise<string> {
    const body = createFormData({ name, phone, objectType, description });

    if (photo) {
      body.set('photo', photo);
    }

    const response = await fetch('/api/installation', {
      method: 'POST',
      body,
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(120_000),
    });

    if (!response.ok) {
      throw new InstallationSubmissionError(response.status);
    }

    const { id } = (await response.json()) as { id?: unknown };

    if (typeof id !== 'string' || !/^[A-F0-9]{8}$/.test(id)) {
      throw new Error('Invalid installation receipt');
    }

    return id;
  }

  async sendOrder({ name, phone, city, delivery, lines }: OrderRequest, requestId: string): Promise<string> {
    const body = createFormData({ requestId, name, phone, city, delivery, lines: JSON.stringify(lines) });

    const response = await fetch('/api/orders', {
      method: 'POST',
      body,
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(120_000),
    });

    if (response.status !== 201) {
      throw new Error('Order submission failed');
    }

    const { id } = (await response.json()) as { id?: unknown };

    if (id !== requestId.slice(0, 8).toUpperCase()) {
      throw new Error('Invalid order receipt');
    }

    return id;
  }
}
