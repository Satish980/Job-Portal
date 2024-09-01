import { getJobs } from "@/api/apiJob";
import useFetch from "@/hooks/use-fetch";
import React, { useEffect } from "react";

const JobListing = () => {
  const { fn: fnJobs, data: dataJobs, loading, error } = useFetch(getJobs, {});
  console.log("==== data", dataJobs, loading, error);
  useEffect(() => {
    fnJobs();
  }, []);
  return <div>JobListing</div>;
};

export default JobListing;
