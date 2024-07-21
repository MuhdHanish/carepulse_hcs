"use client";

import { ReactNode } from "react";
import Image from "next/image";

import { Control } from "react-hook-form";

import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";

import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";

export enum EFormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
};

type TCustomFormFieldProps = {
  control: Control<any>;
  fieldType: EFormFieldType;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD" | string;
  showTimeSelect?: boolean;
  children?: ReactNode;
  renderSkeleton?: (field: any) => ReactNode;
};

const RenderField = ({ field, props }: { field: any; props: TCustomFormFieldProps; }) => {
  const {
    name,
    label,
    fieldType,
    placeholder,
    iconSrc,
    iconAlt,
    showTimeSelect,
    dateFormat,
    renderSkeleton,
    children,
    disabled
  } = props;
  
  switch (fieldType) {
    case EFormFieldType.INPUT:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          {iconSrc && (
            <Image
              src={iconSrc}
              alt={iconAlt || `${name}-icon`}
              height={24}
              width={24}
              className="ml-2"
            />
          )}
          <FormControl>
            <Input
              placeholder={placeholder}
              {...field}
              className="shad-input border-0"
            />
          </FormControl>
        </div>
      );
    case EFormFieldType.PHONE_INPUT:
      return (
        <FormControl>
          <PhoneInput
            placeholder={placeholder}
            defaultCountry="US"
            {...field}
            international
            className="input-phone"
          />
        </FormControl>
      );
    case EFormFieldType.DATE_PICKER:
      return (
        <div className="flex rounded-md border border-dark-500 bg-dark-400">
          <Image
            src={`/assets/icons/calendar.svg`}
            height={24}
            width={24}
            alt="calender-icon"
            className="ml-2"
          />
          <FormControl>
            <DatePicker
              selected={field.value}
              onChange={(date) => field.onChange(date)}
              showTimeSelect={showTimeSelect ?? false}
              dateFormat={dateFormat ?? 'MM/dd/yyyy'}
              timeInputLabel="Time:"
              wrapperClassName="date-picker"
            />
          </FormControl>
        </div>
      );
    case EFormFieldType.SKELETON:
      return (
        renderSkeleton ? renderSkeleton(field) : null
      );
    case EFormFieldType.SELECT:
      return (
        <FormControl>
          <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="shad-select-trigger">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent
              className="shad-select-content">
              {children}
            </SelectContent>
          </Select>
        </FormControl>
      );
    case EFormFieldType.TEXTAREA:
      return (
        <FormControl>
          <Textarea
            placeholder={placeholder}
            {...field}
            className="shad-textArea"
            disabled={disabled}
          />
        </FormControl>
      );
    case EFormFieldType.CHECKBOX:
      return (
        <div className="flex items-center gap-4">
          <Checkbox
            id={name}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
          <label
            htmlFor={name}
            className="checkbox-label">
            {label}
          </label>
        </div>
      );
    default:
      break;
  }
}

export const CustomFormField = (props: TCustomFormFieldProps) => {
  const { control, fieldType, name, label } = props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== EFormFieldType.CHECKBOX && label && (
            <FormLabel>{label}</FormLabel>
          )}
          <RenderField field={field} props={props} />
          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
}
