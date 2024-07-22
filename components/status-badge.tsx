import clsx from "clsx";
import Image from "next/image";
import { StatusIcon } from "@/constance";

export const StatusBadge = ({ status }: { status: Status }) => {
  return (
    <div className={clsx("status-badge", {
      "bg-green-600": status === "scheduled",
      "bg-blue-600": status === "pending",
      "bg-red-600": status === "cancelled",
    })}>
      <Image
        src={StatusIcon[status]}
        height={24}
        width={24}
        alt={`${status}-icon`}
        className="h-fit w-3"
      />
      <p className={clsx("text-12-semibold capitalize", {
        "text-green-500": status === "scheduled",
        "text-blue-500": status === "pending",
        "text-red-500": status === "cancelled",
      })}>{status}</p>
    </div>
  );
}
