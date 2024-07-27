import { Button } from "@/components/ui/button";
import { Doctors } from "@/constance";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

export default async function Success({ params: { userId }, searchParams }: SearchParamProps) {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);
  Sentry.metrics.set("user_view_new_appiontment_success", appointment?.patient?.$id);
  const doctor = Doctors.find(doctor => doctor?.name === appointment?.primaryPhysician);
  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href={`/`}>
          <Image
            src={`/assets/icons/logo-full.svg`}
            height={1000}
            width={1000}
            alt="logo"
            className="h-10 w-fit"
          />
        </Link>
        <section className="flex flex-col items-center">
          <Image
            src={`/assets/gifs/success.gif`}
            height={300}
            width={300}
            alt="success-gif"
          />
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-500">appointment request</span> has
            been successfully submitted!
          </h2>
          <p className="text-dark-700">We'll be in touch shortly to confirm.</p>
        </section>
        <section className="request-details">
          <p className="text-dark-700">Requested appointment details:</p>
          <div className="flex items-center gap-3">
            {doctor?.image && (
              <Image
                src={doctor?.image!}
                alt="doctor-image"
                width={100}
                height={100}
                className="size-6"
              />
            )}
            {doctor?.name && (
              <p className="whitespace-nowrap">Dr. {doctor?.name!}</p>
            )}
          </div>
          {appointment?.schedule && (
            <div className="flex gap-2">
              <Image
                src={`/assets/icons/calendar.svg`}
                height={24}
                width={24}
                alt="calender-icon"
              />
              <p>{formatDateTime(appointment?.schedule)?.dateTime}</p>
            </div>
          )}
        </section>
        <Button
          className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>
        <p className="copyright">© 2024 CarePluse</p>
      </div>
    </div>
  );
}
