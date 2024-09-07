import { getSingleJob, updateHiringStatus } from "@/api/apiJob";
import useFetch from "@/hooks/use-fetch";
import { useUser } from "@clerk/clerk-react";
import MDEditor from "@uiw/react-md-editor";
import { Briefcase, DoorClosed, DoorOpen, MapPinIcon } from "lucide-react";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { BarLoader } from "react-spinners";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ApplyJobDrawer from "@/components/apply-job";
import ApplicationCard from "@/components/application-card";

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

  const {
    fn: fnUpdateHiringStatus,
    loading: loadingHiringStatus,
    error: updateHiringStatusError,
  } = useFetch(updateHiringStatus, {
    job_id: id,
  });

  const handleStatusChange = (value) => {
    const isOpen = value === "open";
    fnUpdateHiringStatus(isOpen).then(() => fnJob());
  };

  useEffect(() => {
    if (isLoaded) {
      fnJob();
    }
  }, [isLoaded]);

  if (!isLoaded || jobLoading) {
    return <BarLoader className="mb-4" width="100%" color="#36d7b7" />;
  }
  return (
    <div className="flex flex-col gap-8 mt-5">
      <div className="flex flex-col-reverse gap-6 md:flex-row justify-between items-center">
        <h1 className="gradient-title font-extrabold pb-3 text-4xl sm:text-6xl">
          {jobData?.title}
        </h1>
        <img
          src={jobData?.company?.logo_url}
          className="h-12"
          alt="Company logo"
        />
      </div>

      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <MapPinIcon />
          {jobData?.location}
        </div>

        <div className="flex gap-2">
          <Briefcase /> {jobData?.applications?.length} Applicants
        </div>

        <div className="flex gap-2">
          {jobData?.is_open ? (
            <>
              <DoorOpen /> Open
            </>
          ) : (
            <>
              <DoorClosed /> Closed
            </>
          )}
        </div>
      </div>

      {/* hiring status */}
      {loadingHiringStatus && (
        <BarLoader className="mb-4" width="100%" color="#36d7b7" />
      )}
      {jobData?.recruiter_id === user?.id && (
        <Select onValueChange={handleStatusChange}>
          <SelectTrigger
            className={`w-full ${
              jobData?.is_open ? "bg-green-950" : "bg-red-950"
            }`}
          >
            <SelectValue
              placeholder={`Hiring Status ${
                jobData?.is_open ? `( Open )` : `( Closed )`
              }`}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"open"}>Open</SelectItem>
            <SelectItem value={"close"}>Closed</SelectItem>
          </SelectContent>
        </Select>
      )}

      <h2 className="text-2xl sm:text-3xl font-bold">About the job</h2>
      <p className="sm:text-lg">{jobData?.description}</p>

      <h2 className="text-2xl sm:text-3xl font-bold">
        What we are looking for
      </h2>

      <MDEditor.Markdown
        source={jobData?.requirements}
        className="bg-transparent sm:text-lg"
      />

      {jobData?.recruiter_id !== user?.id && (
        <>
          <ApplyJobDrawer
            job={jobData}
            user={user}
            fetchJob={fnJob}
            applied={jobData?.applications.find(
              (application) => application.candidate_id === user.id
            )}
          />
        </>
      )}

      {/* render applications */}
      {jobData?.applications?.length && jobData?.recruiter_id !== user?.id && (
        <div className="flex flex-col gap-2">
          <h2 className="text-2xl sm:text-3xl font-bold">Applications</h2>
          {jobData?.applications?.map((application) => {
            return <ApplicationCard key={application.id} application={application}/>
          })}
        </div>
      )}
    </div>
  );
};

export default Job;
