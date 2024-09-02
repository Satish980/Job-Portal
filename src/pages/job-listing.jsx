import React, { useEffect, useState } from "react";
import { BarLoader } from "react-spinners";
import { useUser } from "@clerk/clerk-react";

import { getJobs } from "@/api/apiJob";
import useFetch from "@/hooks/use-fetch";
import JobCard from "@/components/job-card";

const JobListing = () => {
  const { isLoaded } = useUser();
  const [location, setLocation] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    fn: fnJobs,
    data: jobs,
    loading: jobsLoading,
    error,
  } = useFetch(getJobs, {
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

  if (!isLoaded) {
    return <BarLoader className="mb-4" width="100%" color="#36d7b7" />;
  }

  return (
    <div>
      <h1 className="gradient-title font-extrabold text-6xl text-center pb-8 sm:text-7xl">
        Latest Jobs
      </h1>

      {/* filters */}
      {jobsLoading && (
        <BarLoader className="mt-4" width="100%" color="#36d7b7" />
      )}

      {jobsLoading === false && (
        <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs?.length ? (
            jobs.map((job) => {
              return <JobCard key={job?.id} job={job} savedInit={!!job?.saved?.length}/>;
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
