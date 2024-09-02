import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { useUser } from "@clerk/clerk-react";

import { getJobs } from "@/api/apiJob";
import useFetch from "@/hooks/use-fetch";
import JobCard from "@/components/job-card";
import { getCompanies } from "@/api/apiCompanies";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { State } from "country-state-city";

const JobListing = () => {
  const { isLoaded } = useUser();
  const [location, setLocation] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    fn: fnJobs,
    data: jobs,
    loading: jobsLoading,
    error: jobsError,
  } = useFetch(getJobs, {
    location,
    company_id: companyId,
    searchQuery,
  });

  const {
    fn: fnCompanies,
    data: companies,
    loading: companiesLoading,
    error: companiesError,
  } = useFetch(getCompanies, {
    location,
    company_id: companyId,
    searchQuery,
  });

  // console.log("==== data", dataJobs, loading, error);
  useEffect(() => {
    if (isLoaded) {
      fnJobs();
    }
  }, [isLoaded, location, companyId, searchQuery]);

  useEffect(() => {
    if (isLoaded) {
      fnCompanies();
    }
  }, [isLoaded]);

  const handleSearch = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const query = formData.get("search-query");
    if (query) setSearchQuery(query);
  };

  const clearFilters = () => {
    setCompanyId("");
    setLocation("");
    setSearchQuery("");
  };

  if (!isLoaded) {
    return <BarLoader className="mb-4" width="100%" color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl text-center pb-8 sm:text-7xl">
        Latest Jobs
      </h1>

      {/* filters */}
      <form
        onSubmit={handleSearch}
        className="h-14 w-full flex items-center gap-2 mb-3"
      >
        <Input
          type="text"
          placeholder="Search by job title"
          name="search-query"
          className="h-full flex-1 px-4 text-md"
        />
        <Button variant="blue" className="h-full sm:w-28">
          Search
        </Button>
      </form>

      {/* states filter */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Select value={location} onValueChange={(value) => setLocation(value)}>
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

        {/* companies filter */}
        <Select
          value={companyId}
          onValueChange={(value) => setCompanyId(value)}
          loading={companiesLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by company" />
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
        <Button
          variant="destructive"
          onClick={clearFilters}
          className="sm:w-1/2"
        >
          Clear filters
        </Button>
      </div>

      {jobsLoading && (
        <BarLoader className="mt-4" width="100%" color="#36d7b7" />
      )}

      {jobsLoading === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs?.length ? (
            jobs.map((job) => {
              return (
                <JobCard
                  key={job?.id}
                  job={job}
                  savedInit={!!job?.saved?.length}
                />
              );
            })
          ) : (
            <div>No jobs found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobListing;
