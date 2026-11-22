"use client";
import AdminResource from "@/components/AdminResource";
export default function Page() { return <AdminResource resource="categories" title="Categories" columns={[{ key: "name", label: "Name" }, { key: "slug", label: "Slug" }, { key: "isActive", label: "Active", render: r => (r.isActive ? "Yes" : "No") }]}
  fields={[{ key: "name", label: "Name", type: "text" }, { key: "image", label: "Image URL (optional)", type: "text" }, { key: "description", label: "Description", type: "textarea" }, { key: "isActive", label: "Active", type: "checkbox" }]} />; }
