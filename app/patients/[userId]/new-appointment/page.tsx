import { AppointmentForm } from "@/components/forms/appointment-form";
import { getPatient } from "@/lib/actions/patient.actions";
import Image from "next/image";
import * as Sentry from "@sentry/nextjs";

export default async function NewApponitment({ params: { userId } }: SearchParamProps) {
  const patient = await getPatient(userId);
  Sentry.metrics.set("user_view_new_appointment", patient?.$id);
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 justify-between">
          <Image
            src={`/assets/icons/logo-full.svg`}
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />
          <AppointmentForm type="create" userId={userId} patientId={patient?.$id} />
          <p className="copyright py-12">© 2024 CarePluse</p>
        </div>
      </section>
      <Image
        src={`/assets/images/appointment-img.png`}
        height={1000}
        width={1000}
        alt="appointment-side-image"
        className="side-img max-w-[390px] bg-bottom"
      />
    </div>
  );
}
