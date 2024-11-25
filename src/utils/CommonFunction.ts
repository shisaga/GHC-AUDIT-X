import moment from "moment-timezone";
import { countries } from "countries-list";
import {
  countries as CountriesMoment,
  zones,
} from "moment-timezone/data/meta/latest.json";
import { DATE_FORMAT } from "@/types/enums";

const countryCodes = Object.keys(countries);

export const getCurrentCountry = () => {
  return getCountryFromZone(moment.tz.guess());
};

export const availableCountriesList = countryCodes
  .map((code: string): any => {
    return (countries as any)[`${code}`][`name`];
  })
  .sort((a, b) => a.localeCompare(b));

export const getCountryFromZone = (userTimeZone: string): string => {
  let timeZoneCityToCountry: any = {};

  Object.keys(zones).forEach((z: string) => {
    const cityArr = z.split("/");
    const city = cityArr[cityArr.length - 1];
    timeZoneCityToCountry[city] = (CountriesMoment as any)[
      (zones as any)[z].countries[0]
    ].name;
  });
  timeZoneCityToCountry = {
    ...timeZoneCityToCountry,
    Calcutta: "India",
  };
  const splitArr = userTimeZone.split("/");
  // let userRegion = splitArr[0];
  const userCity = splitArr[splitArr.length - 1];
  const userCountry = timeZoneCityToCountry[userCity];
  return userCountry;
};

export const getAvailableCountryCodesPhoneList: Array<{
  name: string;
  phoneCode: string;
  emoji: any;
  shortCode: any;
}> = countryCodes
  .map((code: string, index: number): any => {
    return {
      shortCode: countryCodes[index].toLocaleLowerCase(),
      name: (countries as any)[code].name,
      phoneCode: (countries as any)[code].phone,
      emoji: (countries as any)[code].emoji,
    };
  })
  .sort((a, b) => a.name.localeCompare(b.name));

export const getPhoneCodeFromCountry = (
  countryCodeForMobile: string = getCurrentCountry()
) => {
  const phone = getAvailableCountryCodesPhoneList.find((elem: any) => {
    return elem.name === countryCodeForMobile;
  });
  return `+${phone?.phoneCode ?? 1}`;
};

export const getShortNameForCountry = (
  country: string = getCurrentCountry()
) => {
  const phone = getAvailableCountryCodesPhoneList.find((elem: any) => {
    return elem.name === country;
  });
  return phone?.shortCode;
};

export const getShortNameForCountryCode = (
  countryPhoneCode: string = getCurrentCountry()
) => {
  const phone = getAvailableCountryCodesPhoneList.find((elem: any) => {
    return `+${elem.phoneCode}` === countryPhoneCode;
  });
  return phone?.shortCode;
};

export const formatPhoneNumber = (input: string) => {
  // Remove all non-numeric characters
  const formattedInput = input?.replace(/\D/g, "");

  // Apply the desired phone number format
  const formattedPhoneNumber = formattedInput?.replace(
    /(\d{3})(\d{3})(\d{4})/,
    "($1) $2-$3"
  );

  return formattedPhoneNumber;
};

export const removeSpecialCharacters = (input: string): string => {
  // Remove all non-numeric characters
  const cleanedInput = input.replace(/\D/g, "");

  return cleanedInput;
};

export const formateDate = (date: number) => {
  return Number(String(date).padEnd(13, "0"));
};

export const getTimestamp = (dateTime: number) => {
  const date = new Date(dateTime);
  const timestamp = date.getTime();
  return Number(String(timestamp).padEnd(13, "0"));
};

export const getDateInFormat = (
  date: number | undefined,
  format: string = "MM/DD/YYYY",
  showTime?: boolean
) => {
  return moment(formateDate(date || Date.now())).format(
    showTime ? `${format} hh:mm A` : format
  );
};

export const debounce = <T extends Function>(func: T, delay: number) => {
  let timeoutId: ReturnType<typeof setTimeout>;

  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export const fullNameFormatter = (firstName: string, lastName: string) => {
  if (firstName || lastName) return firstName + " " + lastName;
  return "-";
};

export const EANumberFormatter = (
  auditorEA: string,
  auditMode: string,
  auditNo: number
) => {
  if (auditNo && auditorEA && auditMode) return auditorEA + auditMode + auditNo;
  return "-";
};

export const dateTimeFormatter = (type: string, value: any) => {
  if (type === DATE_FORMAT.DATE && value)
    return moment(value).format("MM-DD-YYYY");
  if (type === DATE_FORMAT.TIME && value) return moment(value).format("HH:mm");
  if (type === DATE_FORMAT.DATE_AND_TIME && value)
    return moment(value).format("MM-DD-YYYY, HH:mm");
  return "-";
};

export const formatAmount = (amount: string) => {
  if (amount) {
    return  +amount < 0 ?"-"+(`$${parseFloat(amount).toFixed(2)}`).replaceAll("-",""):`$${parseFloat(amount).toFixed(2)}`;
  }
  return "-";
};

export const fileUrlFormatter = (fileName: string) => {
  if (fileName)
    return `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_BUCKET_REGION}.amazonaws.com/${fileName}`;
  return "";
};
