import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";

type TSubmitButtonProps = {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
};

export const SubmitButton = ({
  isLoading,
  className,
  children,
}: TSubmitButtonProps) => {
  return (
    <Button
      type="submit"
      disabled={isLoading}
      className={className ?? "shad-primary-btn w-full"}
    >
      {isLoading ? (
        <div className="flex items-center gap-4">
          <Image
            src={`/assets/icons/loader.svg`}
            alt="loader-icon"
            width={24}
            height={24}
            className="animate-spin"
          />
          Loading...
        </div>
      ) : (
        children
      )}
    </Button>
  );
};
