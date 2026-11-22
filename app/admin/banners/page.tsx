"use client";
import AdminResource from "@/components/AdminResource";
export default function Page() { return <AdminResource resource="banners" title="Homepage banners" columns={[{ key: "title", label: "Title" }, { key: "link", label: "Link" }, { key: "order", label: "Order" }, { key: "isActive", label: "Active", render: r => (r.isActive ? "Yes" : "No") }]}
  fields={[{ key: "title", label: "Title", type: "text" }, { key: "subtitle", label: "Subtitle", type: "text" }, { key: "image", label: "Image URL", type: "text" }, { key: "link", label: "Link (e.g. /sale)", type: "text" }, { key: "order", label: "Order", type: "number" }, { key: "isActive", label: "Active", type: "checkbox" }]} />; }
