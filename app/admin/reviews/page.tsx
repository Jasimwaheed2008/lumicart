"use client";
import AdminResource from "@/components/AdminResource";
export default function Page() { return <AdminResource resource="reviews" title="Reviews" ops={["update", "delete"]} columns={[{ key: "product", label: "Product", render: r => r.product?.name }, { key: "user", label: "User", render: r => r.user?.name }, { key: "rating", label: "Rating" }, { key: "comment", label: "Comment" }, { key: "approved", label: "Visible", render: r => (r.approved ? "Yes" : "Hidden") }]} fields={[{ key: "approved", label: "Visible on site", type: "checkbox" }]} />; }
