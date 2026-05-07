const API_BASE = import.meta.env.VITE_API_BASE || "/api";

export type Tokens = {
  access: string;
  refresh: string;
};

export type InvoiceItem = {
  id?: number;
  description: string;
  quantity: string;
  unit_price: string;
};

export type Invoice = {
  id: number;
  number: string;
  customer_name: string;
  customer_email: string;
  status: string;
  issue_date: string;
  due_date: string;
  notes: string;
  subtotal: string;
  items: InvoiceItem[];
};

export type UserProfile = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  company_name: string;
  role: string;
};

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const initHeaders = (init.headers || {}) as HeadersInit;
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...initHeaders,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

export function register(payload: {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  company_name?: string;
}) {
  return request("/auth/register/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(username: string, password: string) {
  return request<Tokens>("/auth/token/", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function me(access: string) {
  return request<UserProfile>("/auth/me/", {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
}

export function fetchInvoices(access: string) {
  return request<Invoice[]>("/invoices/", {
    headers: {
      Authorization: `Bearer ${access}`,
    },
  });
}

export function createInvoice(
  access: string,
  payload: {
    number: string;
    customer_name: string;
    customer_email: string;
    issue_date: string;
    due_date: string;
    notes: string;
    status?: string;
    items: InvoiceItem[];
  },
) {
  return request<Invoice>("/invoices/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${access}`,
    },
    body: JSON.stringify({
      ...payload,
      status: payload.status || "draft",
    }),
  });
}

