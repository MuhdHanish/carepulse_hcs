import Image from "next/image";

export default function NewApponitment() {
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
          <p className="copyright py-12">© 2024 CarePluse</p>
        </div>
      </section>
      <Image
        src={`/assets/images/appointment-img.png`}
        height={1000}
        width={1000}
        alt="appointment-side-image"
        className="side-img max-w-[390px]"
      />
    </div>
  );
}
