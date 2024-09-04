import { getSingleJob } from "@/api/apiJob";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";

const Job = () => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();

  const {
    fn: fnJob,
    data: jobData,
    loading: jobLoading,
    error: jobError,
  } = useFetch(getSingleJob, {
    job_id: id,
  });

  useEffect(() => {
    if (isLoaded) {
      fnJob();
    }
  }, [isLoaded]);

  if (!isLoaded || jobLoading) {
    return <BarLoader className="mb-4" width="100%" color="#36d7b7" />;
  }
  return <div>Job</div>;
};

export default Job;
