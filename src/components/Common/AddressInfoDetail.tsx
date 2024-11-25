"use client";
import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import { Label } from "@/stories/Label/Label";
import SBInput from "@/stories/Input/Input";
import SBSelect from "@/stories/Select/Select";
import { FormikValues } from "formik";
import { availableCountriesList } from "@/utils/CommonFunction";
import { AddressComponent, GoogleAddressParser } from "./GoogleAddressParser";
import usePlacesAutocompleteService from "react-google-autocomplete/lib/usePlacesAutocompleteService";
import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps";
import LoadingSpinner from "./LoadingSpinner";
import { CANADA_PROVINCES } from "@/utils/constant";
import { usePathname } from "next/navigation";
import { Checkbox } from "@material-tailwind/react";
import { Heading } from "@/stories/Heading/Heading";
interface PersonalInfoProps {
  formik: FormikValues;
  handleGeocode?: any;
  cordinates?: any;
  loadingMap?: boolean;
  isError?: boolean;
  type?: string;
}

const AddressInfoDetail = ({
  formik,
  handleGeocode,
  cordinates,
  loadingMap,
  isError,
  type,
}: PersonalInfoProps) => {
  const [placeString, setPlaceString] = useState<string>("");
  const [getBuissnessPlaceString, setBuissnessPlace] = useState<String>("");
  const pathname = usePathname();

  const isAuditpage = pathname.includes("audits");

  const {
    placesService,
    placePredictions,
    getPlacePredictions,
    isPlacePredictionsLoading,
  } = usePlacesAutocompleteService({
    apiKey: process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY,
  });
  const [working, setWorking] = useState(false);

  useEffect(() => {
    if (placeString?.trim() !== "") {
      getPlacePredictions({ input: placeString });
    }
    if (getBuissnessPlaceString?.trim() !== "") {
      getPlacePredictions({ input: getBuissnessPlaceString as string });
    }
  }, [placeString, getBuissnessPlaceString]);

  useEffect(() => {
    setTimeout(() => {
      setWorking(true);
    }, 500);
  }, []);

  return (
    <>
      <div className=" w-full md:gap-[3rem] gap-[1rem] font-[400] text-black flex flex-col md:flex-row">
        <div className="flex-1">
          <div>
            <SearchBar
              label="Autofill address by search"
              data={placeString ? placePredictions : []}
              placeString={placeString}
              isLoading={isPlacePredictionsLoading}
              onChange={(event) => {
                setPlaceString(event.target.value);
                // getPlacePredictions({ input: event.target.value });
              }}
              onHandleSelect={(data: any) => {
                placeString && setPlaceString(data?.description as string);

                placesService?.getDetails(
                  {
                    placeId: data?.place_id,
                  },
                  (placeDetails: any) => {
                    const address = new GoogleAddressParser(
                      placeDetails?.address_components as AddressComponent[]
                    ).result();
                    formik.setValues({
                      ...formik.values,
                      streetAddress:
                        `${address?.street_number ? `${address?.street_number} ` : ""}${address?.street_name || ""}` ||
                        "",
                      city: address?.city || "",
                      province: address?.state || "",
                      country: address?.country || "Canada",
                      postalCode: address?.postal_code || "",
                    });
                  }
                );

                handleGeocode?.(data?.description);
              }}
            />
          </div>
          <div className="flex items-center my-4">
            <hr className="w-2/5 border-colorLighter" />
            <Label
              label="Or"
              className="w-1/6 font-bold text-colorLight text-center"
            />
            <hr className="w-2/5 border-colorLighter" />
          </div>

          <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-5 my-5">
            <SBInput
              id="unit"
              name="unit"
              label="Unit#"
              value={formik.values.unit}
              onChange={(e) => {
                formik.setFieldTouched(e?.target?.name || e?.target?.id, true);
                formik.handleChange(e);
              }}
              touched={Boolean(formik.touched.unit)}
            />
            <SBInput
              id="streetAddress"
              name="streetAddress"
              label="Street Address"
              value={formik.values.streetAddress}
              requiredField={isAuditpage && true}
              onChange={(e) => {
                formik.setFieldTouched(e?.target?.name || e?.target?.id, true);
                formik.handleChange(e);
              }}
              error={Boolean(formik.errors.streetAddress) || isError}
              touched={Boolean(formik.touched.streetAddress) || isError}
              errorMessage={formik.errors.streetAddress}
            />
            <SBInput
              id="city"
              name="city"
              label="City"
              value={formik.values.city}
              requiredField={isAuditpage && true}
              onChange={(e) => {
                formik.setFieldTouched(e?.target?.name || e?.target?.id, true);
                formik.handleChange(e);
              }}
              error={Boolean(formik.errors.city) || isError}
              touched={Boolean(formik.touched.city) || isError}
              errorMessage={formik.errors.city}
            />
            {formik.values?.country === "Canada" ? (
              <SBSelect
                id="province"
                label="Province"
                value={formik.values?.province}
                hideOptionalOption={true}
                requiredField={isAuditpage && true}
                onChange={(data) => {
                  formik.setFieldValue("province", data);
                }}
                options={CANADA_PROVINCES.map((element: string) => {
                  return { value: element, label: element };
                })}
                error={
                  Boolean(formik.touched.province && formik.errors.province) ||
                  isError
                }
                touched={Boolean(formik.touched.province) || isError}
                errorMessage={formik.touched.province || ""}
              />
            ) : (
              <SBInput
                id="province"
                name="province"
                label="Province"
                value={formik.values?.province}
                requiredField={isAuditpage && true}
                onChange={(e) => {
                  formik.setFieldTouched(
                    e?.target?.name || e?.target?.id,
                    true
                  );
                  formik.handleChange(e);
                }}
                error={Boolean(formik.errors.province) || isError}
                touched={Boolean(formik.touched.province) || isError}
                errorMessage={formik.errors.province}
              />
            )}

            <SBSelect
              id="addressInfo.country"
              label="Country"
              options={availableCountriesList.map((element: string) => {
                return { value: element, label: element };
              })}
              value={formik.values?.country}
              requiredField={isAuditpage && true}
              onChange={(value: string) => {
                formik.setFieldTouched("country", true);
                formik.setFieldValue("country", value);
              }}
              touched={Boolean(formik.touched.country)}
            />

            <SBInput
              id="postalCode"
              name="postalCode"
              label="Postal Code"
              value={
                formik.values?.postalCode.length < 6
                  ? formik.values?.postalCode.replaceAll(" ", "")
                  : formik.values?.postalCode.slice(0, 3) +
                    " " +
                    formik.values?.postalCode.slice(
                      3,
                      formik.values?.postalCode.length
                    )
              }
              requiredField={isAuditpage && true}
              onChange={(e) => {
                e.target.value = e.target.value.replace(" ", "");
                if (e.target.value.length > 6) return;
                formik.setFieldTouched(e?.target?.name || e?.target?.id, true);
                formik.handleChange(e);
              }}
              error={Boolean(formik.errors.postalCode) || isError}
              touched={Boolean(formik.touched.postalCode) || isError}
              errorMessage={formik.errors.postalCode}
            />
          </div>
        </div>
        {cordinates && (
          <div
            style={{ height: "35vh", width: "100%" }}
            className="rounded-normal overflow-hidden flex-1 mb-4"
          >
            {!loadingMap && working ? (
              <APIProvider
                apiKey={`${process.env.NEXT_PUBLIC_GOOGLE_PLACE_API_KEY}`}
              >
                <Map
                  style={{ minHeight: "35vh" }}
                  defaultCenter={cordinates}
                  defaultZoom={13}
                >
                  <Marker position={cordinates} />
                </Map>
              </APIProvider>
            ) : (
              <LoadingSpinner />
            )}
          </div>
        )}
      </div>
      <div className="flex items-start">
        {pathname.includes("audits") && (
          <Checkbox
            className="text-colorBlack"
            id="isMailingAddressSame"
            name="isMailingAddressSame"
            label="Mailing adress is same as personal address"
            labelProps={{
              className: "text-colorBlack text-sm font-normal",
            }}
            checked={formik.values.isMailingAddressSame}
            onChange={(e) => {
              formik.setFieldTouched(e?.target?.name || e?.target?.id, true);
              formik.handleChange(e);
            }}
          />
        )}
      </div>
{cordinates && !formik.values?.isMailingAddressSame && (
        <>
          <hr className=" border-colorLighter mt-4 mb-6" />

          <div className="mt-4 w-full">
            <div className="mb-4">
              <Heading type="h5" label="Mailing address info" />
            </div>

            <div className=" w-full md:gap-[3rem] gap-[1rem]  font-[400] text-black flex flex-col md:flex-row">
              <div className="flex-1">
                <div>
                  <SearchBar
                    label="Autofill address by search"
                    data={getBuissnessPlaceString ? placePredictions : []}
                    placeString={getBuissnessPlaceString as string}
                    isLoading={isPlacePredictionsLoading}
                    onChange={(event) => {
                      setBuissnessPlace(event.target.value);
                      // getPlacePredictions({ input: event.target.value });
                    }}
                    onHandleSelect={(data: any) => {
                      getBuissnessPlaceString &&
                        setBuissnessPlace(data?.description as string);

                      placesService?.getDetails(
                        {
                          placeId: data?.place_id,
                        },
                        (placeDetails: any) => {
                          const address = new GoogleAddressParser(
                            placeDetails?.address_components as AddressComponent[]
                          ).result();
                          formik.setValues({
                            ...formik.values,
                            mailingAddress: {
                              streetAddress:
                                `${address?.street_number ? `${address?.street_number} ` : ""}${address?.street_name || ""}` ||
                                "",
                              city: address?.city || "",
                              province: address?.state || "",
                              country: address?.country || "Canada",
                              postalCode: address?.postal_code || "",
                            },
                          });
                        }
                      );
                    }}
                  />
                </div>
                <div className="flex items-center my-4">
                  <hr className="w-2/5 border-colorLighter" />
                  <Label
                    label="Or"
                    className="w-1/6 font-bold text-colorLight text-center"
                  />
                  <hr className="w-2/5 border-colorLighter" />
                </div>

                <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-5 my-5">
                  <SBInput
                    id="mailingAddress.unit"
                    name="mailingAddress.unit"
                    label="Unit#"
                    value={formik.values?.mailingAddress?.unit}
                    onChange={(e) => {
                      formik.setFieldTouched(
                        e?.target?.name || e?.target?.id,
                        true
                      );
                      formik.handleChange(e);
                    }}
                    touched={Boolean(formik.touched?.mailingAddress?.unit)}
                  />

                  <SBInput
                    id="mailingAddress.streetAddress"
                    name="mailingAddress.streetAddress"
                    label="Street Address"
                    value={formik?.values?.mailingAddress?.streetAddress}
                    requiredField
                    onChange={(e) => {
                      formik.setFieldTouched(
                        e?.target?.name || e?.target?.id,
                        true
                      );
                      formik.handleChange(e);
                    }}
                    error={
                      Boolean(
                        formik.touched?.mailingAddress?.streetAddress &&
                          formik.errors?.mailingAddress?.streetAddress
                      ) || isError
                    }
                    touched={
                      Boolean(formik.touched?.mailingAddress?.streetAddress) ||
                      isError
                    }
                    errorMessage={
                      formik.errors?.mailingAddress?.streetAddress || ""
                    }
                  />
                  <SBInput
                    id="mailingAddress.city"
                    name="mailingAddress.city"
                    label="City"
                    value={formik.values?.mailingAddress?.city}
                    requiredField
                    onChange={(e) => {
                      formik.setFieldTouched(
                        e?.target?.name || e?.target?.id,
                        true
                      );
                      formik.handleChange(e);
                    }}
                    error={
                      Boolean(
                        formik.touched?.mailingAddress?.city &&
                          formik.errors?.mailingAddress?.city
                      ) || isError
                    }
                    touched={
                      Boolean(formik.touched?.mailingAddress?.city) ||
                      isError
                    }
                    errorMessage={
                      formik.errors?.mailingAddress?.city || ""
                    }
                  />
                  {formik.values?.mailingAddress?.country === "Canada" ? (
                    <SBSelect
                      id="mailingAddress.province"
                      label="Province"
                      value={formik.values?.mailingAddress?.province}
                      hideOptionalOption={true}
                      requiredField
                      onChange={(data) => {
                        formik.setFieldValue("mailingAddress.province", data);
                      }}
                      options={CANADA_PROVINCES.map((element: string) => {
                        return { value: element, label: element };
                      })}
                      error={
                        Boolean(
                          formik.touched?.mailingAddress?.province &&
                            formik.errors?.mailingAddress?.province
                        ) || isError
                      }
                      touched={
                        Boolean(formik.touched?.mailingAddress?.province) ||
                        isError
                      }
                      errorMessage={
                        formik.errors?.mailingAddress?.province || ""
                      }
                    />
                  ) : (
                    <SBInput
                      id="mailingAddress.province"
                      name="mailingAddress.province"
                      label="Province"
                      value={formik.values?.mailingAddress?.province}
                      requiredField
                      onChange={(e) => {
                        formik.setFieldTouched(
                          e?.target?.name || e?.target?.id,
                          true
                        );
                        formik.handleChange(e);
                      }}
                      error={
                        Boolean(formik.errors?.mailingAddress?.province) ||
                        isError
                      }
                      touched={
                        Boolean(formik.touched.mailingAddress?.province) ||
                        isError
                      }
                      errorMessage={formik.errors.mailingAddress?.province}
                    />
                  )}

                  <SBSelect
                    id="mailingAddress.country"
                    label="Country"
                    options={availableCountriesList.map((element: string) => {
                      return { value: element, label: element };
                    })}
                    requiredField
                    value={formik.values?.mailingAddress?.country}
                    onChange={(value: string) => {
                      formik.setFieldTouched("mailingAddress.country", true);
                      formik.setFieldValue("mailingAddress.country", value);
                    }}
                
                    error={
                      Boolean(formik.errors?.mailingAddress?.country) ||
                      isError
                    }
                    touched={
                      Boolean(formik.touched.mailingAddress?.country) ||
                      isError
                    }
                    errorMessage={formik.errors.mailingAddress?.country}

                  />
                  <SBInput
                    id="mailingAddress.postalCode"
                    name="mailingAddress.postalCode"
                    label="Postal Code"
                    requiredField
                    value={
                      formik.values?.mailingAddress?.postalCode.length < 6
                        ? formik.values?.mailingAddress?.postalCode.replaceAll(" ", "")
                        : formik.values?.mailingAddress?.postalCode.slice(0, 3) +
                          " " +
                          formik.values?.mailingAddress?.postalCode.slice(
                            3,
                            formik.values?.mailingAddress?.postalCode.length
                          )
                    }
                   
                    onChange={(e) => {
                      e.target.value = e.target.value.replace(" ", "");
                      if (e.target.value.length > 6) return;
                      formik.setFieldTouched(e?.target?.name || e?.target?.id, true);
                      formik.handleChange(e);
                    }}
                    
                    error={
                      Boolean(formik.errors?.mailingAddress?.postalCode) ||
                      isError
                    }
                    touched={
                      Boolean(formik.touched.mailingAddress?.postalCode) ||
                      isError
                    }
                    errorMessage={formik.errors.mailingAddress?.postalCode}
                    
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AddressInfoDetail;
