import React from "react";
import Header from "../../ui/Header";
import MySummary from "./MySummeries";

export default function Dashboard() {
  return (
    <div className="min-h-[100dvh] w-[100dvw] flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-start py-6 px-4 sm:px-8">
        <MySummary />
      </main>
    </div>
  );
}
