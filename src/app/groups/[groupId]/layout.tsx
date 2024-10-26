"use client";

import Header from "@/app/components/Header";

export default function GroupPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="d-flex flex-column overflow-hidden"
      style={{ height: "100vh" }}
    >
      <Header />
      <div className="flex-grow-1 d-flex position-relative">{children}</div>
    </div>
  );
}
