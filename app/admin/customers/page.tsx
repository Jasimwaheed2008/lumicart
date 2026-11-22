"use client";
import AdminResource from "@/components/AdminResource";
export default function Page() { return <AdminResource resource="users" title="Customers" ops={[]} fields={[]} columns={[{ key: "name", label: "Name" }, { key: "email", label: "Email" }, { key: "createdAt", label: "Joined", render: r => new Date(r.createdAt).toLocaleDateString() }]} />; }
