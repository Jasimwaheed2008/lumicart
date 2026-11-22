"use client";
import AdminResource from "@/components/AdminResource";
export default function Page() { return <AdminResource resource="messages" title="Messages" ops={["update", "delete"]} columns={[{ key: "name", label: "From", render: r => `${r.name} <${r.email}>` }, { key: "subject", label: "Subject" }, { key: "message", label: "Message" }, { key: "read", label: "Read", render: r => (r.read ? "Yes" : "New") }]} fields={[{ key: "read", label: "Mark as read", type: "checkbox" }]} />; }
