"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Form, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CustomFormField, EFormFieldType } from "../custom-form-field";
import { SubmitButton } from "../submit-button";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import { FileUploader } from "../file-uploader";

import {
  Doctors,
  GenderOptions,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constance";
import { PatientFormValidation } from "@/lib/validation";
import { registerPatient } from "@/lib/actions/patient.actions";

export const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: { ...PatientFormDefaultValues },
  });

  function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setError("");
    startTransition(async () => {
      try {
        let formData;
        if (
          values.identificationDocument &&
          values.identificationDocument?.length > 0
        ) {
          const blobFile = new Blob([values.identificationDocument[0]], {
            type: values.identificationDocument[0]?.type,
          });
          formData = new FormData();
          formData.append("blobFile", blobFile);
          formData.append("fileName", values.identificationDocument[0]?.name);
        }
        const patientData: RegisterUserParams = {
          ...values,
          userId: user?.$id,
          birthDate: new Date(values.birthDate),
          identificationDocument: formData,
        };
        const patient = await registerPatient(patientData);
        if (patient) router.push(`/patients/${user?.$id}/new-appointment`);
      } catch (error: any) {
        setError("Something went wrong. Please try again later.");
      }
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        <section className="space-y-4">
          <h1 className="header">Welcome 🎉</h1>
          <p className="text-dark-700">Let us know more about yourself.</p>
        </section>
        <section className="space-y-4">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Personal Information</h2>
          </div>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={EFormFieldType.INPUT}
          name="name"
          label="Full name"
          placeholder="Jhon Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user-icon"
        />
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={EFormFieldType.INPUT}
            name="email"
            label="Email address"
            placeholder="jhonedoe@example.com"
            iconSrc="/assets/icons/email.svg"
            iconAlt="email-icon"
          />
          <CustomFormField
            control={form.control}
            fieldType={EFormFieldType.PHONE_INPUT}
            name="phone"
            label="Phone number"
            placeholder="(999) 999-999"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={EFormFieldType.DATE_PICKER}
            name="birthDate"
            label="Date of birth"
          />
          <CustomFormField
            control={form.control}
            fieldType={EFormFieldType.SKELETON}
            name="gender"
            label="Gender"
            renderSkeleton={(field) => (
              <FormControl>
                <RadioGroup
                  className="flex h-[46px] gap-3 xl:justify-between"
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  {GenderOptions.map((option, index) => (
                    <div key={`${option}-${index}`} className="radio-group">
                      <RadioGroupItem value={option} id={option} />
                      <Label htmlFor={option} className="cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
            )}
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={EFormFieldType.INPUT}
            name="address"
            label="Address"
            placeholder="14ᵗʰ  Street, New York"
          />
          <CustomFormField
            control={form.control}
            fieldType={EFormFieldType.INPUT}
            name="occupation"
            label="Occupation"
            placeholder="Software Engineer"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={EFormFieldType.INPUT}
            name="emergencyContactName"
            label="Emergency contact name"
            placeholder="Guardian's name"
          />
          <CustomFormField
            control={form.control}
            fieldType={EFormFieldType.PHONE_INPUT}
            name="emergencyContactNumber"
            label="Emergency contact number"
          />
        </div>
        <section className="space-y-4">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Medical Information</h2>
          </div>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={EFormFieldType.SELECT}
          name="primaryPhysician"
          label="Primary physician"
          placeholder="Select a physician"
        >
          {Doctors.map((doctor, index) => (
            <SelectItem key={`${doctor?.name}-${index}`} value={doctor?.name}>
              <div className="flex cursor-pointer items-center gap-2">
                {doctor?.image && (
                  <Image
                    src={doctor?.image}
                    width={32}
                    height={32}
                    alt={doctor?.name ?? "doctor-image"}
                    className="rounded-full"
                  />
                )}
                <p>{doctor?.name}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={EFormFieldType.INPUT}
            name="insuranceProvider"
            label="Insurance provider"
            placeholder="Blue Cross"
          />
          <CustomFormField
            control={form.control}
            fieldType={EFormFieldType.INPUT}
            name="insurancePolicyNumber"
            label="Insurance policy number"
            placeholder="ABC1234567"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={EFormFieldType.TEXTAREA}
            name="allergies"
            label="Allergies (if any)"
            placeholder="ex: Peanuts, Penicillin, Pollen"
          />
          <CustomFormField
            control={form.control}
            fieldType={EFormFieldType.TEXTAREA}
            name="currentMedication"
            label="Current medication"
            placeholder="ex: Ibuprofen 200mg, Levothyroxine 50mcg"
          />
        </div>
        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField
            control={form.control}
            fieldType={EFormFieldType.TEXTAREA}
            name="familyMedicalHistory"
            label="Family medical history (if relevant)"
            placeholder="ex: Mother had breast cancer"
          />
          <CustomFormField
            control={form.control}
            fieldType={EFormFieldType.TEXTAREA}
            name="pastMedicalHistory"
            label="Past medical history"
            placeholder="ex: Asthma diagnosis in childhood"
          />
        </div>
        <section className="space-y-4">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Identification and Verfication</h2>
          </div>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={EFormFieldType.SELECT}
          name="identificationType"
          label="Identification type"
          placeholder="Select a identification type"
        >
          {IdentificationTypes.map((type, index) => (
            <SelectItem key={`${type}-${index}`} value={type}>
              <div className="flex cursor-pointer items-center gap-2">
                <p>{type}</p>
              </div>
            </SelectItem>
          ))}
        </CustomFormField>
        <CustomFormField
          control={form.control}
          fieldType={EFormFieldType.INPUT}
          name="identificationNumber"
          label="Identification number"
          placeholder="123456789"
        />
        <CustomFormField
          control={form.control}
          fieldType={EFormFieldType.SKELETON}
          name="identificationDocument"
          label="Scanned copy of identification document"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />
        <section className="space-y-4">
          <div className="mb-9 space-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
          </div>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={EFormFieldType.CHECKBOX}
          name="treatmentConsent"
          label="I consent to receive treatment for my health condition."
        />
        <CustomFormField
          control={form.control}
          fieldType={EFormFieldType.CHECKBOX}
          name="disclosureConsent"
          label="I consent to the use and disclosure of my health information for treatment purposes."
        />
        <CustomFormField
          control={form.control}
          fieldType={EFormFieldType.CHECKBOX}
          name="privacyConsent"
          label="I acknowledge that I have reviewed and agree to the privacy policy."
        />
        <FormMessage className="shad-error" children={error} />
        <SubmitButton isLoading={isPending}>Complete Registration</SubmitButton>
      </form>
    </Form>
  );
};
