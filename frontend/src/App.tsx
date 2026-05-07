import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { createInvoice, fetchInvoices, login, me, register } from "./api";
import type { Invoice } from "./api";

type AuthMode = "login" | "register";

function App() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [message, setMessage] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");

  const [invoiceNumber, setInvoiceNumber] = useState("INV-001");
  const [customerName, setCustomerName] = useState("Acme LLC");
  const [customerEmail, setCustomerEmail] = useState("billing@acme.test");
  const [issueDate, setIssueDate] = useState("2026-05-07");
  const [dueDate, setDueDate] = useState("2026-05-14");
  const [description, setDescription] = useState("Development services");
  const [quantity, setQuantity] = useState("10");
  const [unitPrice, setUnitPrice] = useState("35.00");

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  const isAuthenticated = useMemo(() => accessToken.length > 0, [accessToken]);

  async function onAuthSubmit(event: FormEvent) {
    event.preventDefault();
    setMessage("");

    try {
      if (mode === "register") {
        await register({
          username,
          email,
          password,
          company_name: companyName,
        });
        setMessage("User created. Now login with the same credentials.");
        setMode("login");
        return;
      }

      const tokens = await login(username, password);
      setAccessToken(tokens.access);
      const currentUser = await me(tokens.access);
      setMessage(`Logged in as ${currentUser.username}`);
      const list = await fetchInvoices(tokens.access);
      setInvoices(list);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unexpected error");
    }
  }

  async function onCreateInvoice(event: FormEvent) {
    event.preventDefault();
    setMessage("");

    try {
      await createInvoice(accessToken, {
        number: invoiceNumber,
        customer_name: customerName,
        customer_email: customerEmail,
        issue_date: issueDate,
        due_date: dueDate,
        notes: "",
        items: [
          {
            description,
            quantity,
            unit_price: unitPrice,
          },
        ],
      });
      const list = await fetchInvoices(accessToken);
      setInvoices(list);
      setMessage("Invoice created successfully.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unexpected error");
    }
  }

  return (
    <main className="container">
      <h1>Mini SaaS Invoice</h1>
      <p className="hint">Frontend demo for Django + DRF backend</p>

      {!isAuthenticated && (
        <section className="card">
          <div className="row">
            <button onClick={() => setMode("login")} className={mode === "login" ? "active" : ""}>
              Login
            </button>
            <button onClick={() => setMode("register")} className={mode === "register" ? "active" : ""}>
              Register
            </button>
          </div>
          <form onSubmit={onAuthSubmit}>
            <label>Username</label>
            <input value={username} onChange={(e) => setUsername(e.target.value)} required />
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

            {mode === "register" && (
              <>
                <label>Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <label>Company</label>
                <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </>
            )}

            <button type="submit">{mode === "login" ? "Login" : "Create account"}</button>
          </form>
        </section>
      )}

      {isAuthenticated && (
        <>
          <section className="card">
            <h2>Create Invoice</h2>
            <form onSubmit={onCreateInvoice}>
              <label>Number</label>
              <input value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} required />
              <label>Customer name</label>
              <input value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
              <label>Customer email</label>
              <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} required />
              <label>Issue date</label>
              <input type="date" value={issueDate} onChange={(e) => setIssueDate(e.target.value)} required />
              <label>Due date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />

              <label>Item description</label>
              <input value={description} onChange={(e) => setDescription(e.target.value)} required />
              <label>Quantity</label>
              <input value={quantity} onChange={(e) => setQuantity(e.target.value)} required />
              <label>Unit price</label>
              <input value={unitPrice} onChange={(e) => setUnitPrice(e.target.value)} required />

              <button type="submit">Create invoice</button>
            </form>
          </section>

          <section className="card">
            <h2>Invoices</h2>
            {invoices.length === 0 ? (
              <p>No invoices yet.</p>
            ) : (
              <ul className="list">
                {invoices.map((invoice) => (
                  <li key={invoice.id}>
                    <strong>{invoice.number}</strong> - {invoice.customer_name} ({invoice.status}) - subtotal:{" "}
                    {invoice.subtotal}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}

      {message && <p className="message">{message}</p>}
    </main>
  );
}

export default App;
