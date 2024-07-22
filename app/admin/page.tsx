import { StatsCard } from "@/components/cards/stats-card";
import Image from "next/image";
import Link from "next/link";

export default async function Admin() {
  return (
    <div className="mx-auto flex flex-col max-w-7xl space-y-14">
      <header className="admin-header">
        <Link href={`/`}>
          <Image
            src={`/assets/icons/logo-full.svg`}
            height={32}
            width={162}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>
        <p className="text-16-semibold">Admin Dashboard</p>
      </header>
      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome back! 👋</h1>
          <p className="text-dark-700">Let’s dive into today’s new appointments.</p>
        </section>
        <section className="admin-stat">
          <StatsCard
            type="scheduled"
            count={0}
            label={"Scheduled appointments"}
            icon={`/assets/icons/appointments.svg`}
          />
          <StatsCard
            type="pending"
            count={0}
            label={"Pending appointments"}
            icon={`/assets/icons/pending.svg`}
          />
          <StatsCard
            type="cancelled"
            count={0}
            label={"Cancelled appointments"}
            icon={`/assets/icons/cancelled.svg`}
          />
        </section>
      </main>
    </div>
  );
}
