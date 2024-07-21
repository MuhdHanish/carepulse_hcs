import { RegisterForm } from "@/components/forms/register-form";
import { getUser } from "@/lib/actions/patient.actions";
import Image from "next/image";

export default async function Register({ params: { userId } }: SearchParamProps) {
  const user = await getUser(userId);
  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[890px] flex-1 flex-col py-10">
          <Image
            src={`/assets/icons/logo-full.svg`}
            height={1000}
            width={1000}
            alt="logo"
            className="mb-12 h-10 w-fit"
          />
          <RegisterForm user={user}/>
          <p className="copyright py-12">© 2024 CarePluse</p>
        </div>
      </section>
      <Image
        src={`/assets/images/register-img.png`}
        height={1000}
        width={1000}
        alt="register-image"
        className="side-img max-w-[390px]"
      />
    </div>
  );
}
