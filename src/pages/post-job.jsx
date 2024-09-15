import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { State } from "country-state-city";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/hooks/use-fetch";
import { getCompanies, addNewCompany } from "@/api/apiCompanies";
import { useUser } from "@clerk/clerk-react";
import { BarLoader } from "react-spinners";
import { Navigate, useNavigate } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "@/components/ui/button";
import { addNewJob } from "@/api/apiJob";
import AddCompanyDrawer from "@/components/add-company-drawer";

const schema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  location: z.string().min(1, { message: "Select a location" }),
  company_id: z.string().min(1, { message: "Select or Add a new Company" }),
  requirements: z.string().min(1, { message: "Requirements are required" }),
});
const PostJob = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const {
    register,
    formState: { errors },
    control,
    handleSubmit,
  } = useForm({
    defaultValues: {
      location: "",
      company_id: "",
      requirements: "",
    },
    resolver: zodResolver(schema),
  });

  const {
    fn: fnCompanies,
    data: companies,
    loading: companiesLoading,
    error: companiesError,
  } = useFetch(getCompanies);

  const {
    loading: addJobLoading,
    data: addJobData,
    error: addJobError,
    fn: fnAddJob
  } =  useFetch(addNewJob);

  const onSubmit = (data) => {
    fnAddJob({
      ...data,
      recruiter_id: user.id
    })
  }

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  useEffect(() => {
    if(addJobData?.length > 0) {
      navigate('/jobs')
    }
  }, [addJobData])

  if (!isLoaded || companiesLoading) {
    return <BarLoader className="mb-4" width="100%" color="#36d7b7" />;
  }

  if (user?.unsafeMetadata?.role !== "recruiter") {
    <Navigate to={"/jobs"} />;
  }
  return (
    <div>
      <h1 className="gradient-title font-extrabold text-5xl sm:text-7xl text-center pb-8">
        Post a Job
      </h1>
      <form className="flex flex-col gap-4 p-4 pb-0" onSubmit={handleSubmit(onSubmit)}>
        <Input placeholder="Job title" {...register("title")} />
        {errors?.title && <p className="text-red-500">{errors.title}</p>}

        <Textarea placeholder="Job description" {...register("description")} />
        {errors?.description && (
          <p className="text-red-500">{errors.description}</p>
        )}

        <div className="flex gap-4 items-center">
          <Controller
            name="location"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by state" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {State.getStatesOfCountry("IN").map(({ name }) => {
                      return (
                        <SelectItem value={name} key={name}>
                          {name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          <Controller
            name="company_id"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={field.onChange}
                loading={companiesLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Filter by company">
                    {field.value
                      ? companies.find(
                          (company) => company.id === Number(field.value)
                        )?.name
                      : "Company"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {companies?.map(({ name, id }) => {
                      return (
                        <SelectItem value={id} key={name}>
                          {name}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />

          {/* add company drawer */}
          <AddCompanyDrawer fetchCompanies={fnCompanies}/>
        </div>
        {errors.location && (
          <p className="text-red-500">{errors.location.message}</p>
        )}
        {errors.company_id && (
          <p className="text-red-500">{errors.company_id.message}</p>
        )}
        <Controller
          name="requirements"
          control={control}
          render={({ field }) => <MDEditor
            onChange={field.onChange}
            value={field.value}
          />}
        />
        {errors.requirements && (
          <p className="text-red-500">{errors.requirements.message}</p>
        )}
        {addJobError && (
          <p className="text-red-500">{addJobError?.message}</p>
        )}
        {addJobLoading && <BarLoader className="mb-4" width="100%" color="#36d7b7" />}
        <Button variant="blue" type="submit" size="lg" className="mt-2">Submit</Button>
      </form>
    </div>
  );
};

export default PostJob;
