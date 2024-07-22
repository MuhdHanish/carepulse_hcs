import clsx from "clsx";
import Image from "next/image";

export type TStatsCardProp = {
  type: Status;
  count: number;
  label: string;
  icon: string;
};

export const StatsCard = ({ type, count = 0, label, icon }: TStatsCardProp) => {
  return (
    <div className={clsx("stat-card", {
      "bg-appointments": type === "scheduled",
      "bg-pending": type === "pending",
      "bg-cancelled": type === "cancelled"
    })}>
      <div className="flex items-center gap-4">
      <Image
        src={icon}
        height={32}
        width={32}
        alt={`${label}-icon`}
        className="size-8 w-fit"
        />
        <h2 className="text-32-bold text-white">{count}</h2>
      </div>
      <p className="text-14-regular">{label}</p>
    </div>
  );
}
