import React from "react";
import { Link } from "react-router-dom";
import Autoplay from "embla-carousel-autoplay";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import companies from "../data/companies.json";
import faqs from "../data/faqs.json";

const LandingPage = () => {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
      <section className="text-center">
        <h1 className="flex flex-col items-center justify-center gradient-title text-4xl font-extrabold sm:text-6xl lg:text-8xl tracking-tighter py-4">
          Find your dream job{" "}
          <span className="flex items-center gap-2 sm:gap-6">
            and get{" "}
            <img
              src="./logo.png"
              className="h-14 sm:h-24 lg:h-32"
              alt="Hirrd logo"
            />
          </span>
        </h1>
        <p className="text-gray-300 sm:mt-4 text-sm sm:text-xl">
          Explore thousands of job listing or find the perfect candidate
        </p>
      </section>
      {/* buttons */}
      <div className="flex justify-center gap-6">
        <Link to="/jobs">
          <Button variant="blue" size="xl">
            Find Job
          </Button>
        </Link>
        <Link to="/post-job">
          <Button size="xl" variant="destructive">
            Post a Job
          </Button>
        </Link>
      </div>
      {/* carousel */}

      <Carousel
        className="w-full py-10"
        plugins={[Autoplay({ delay: 2000, stopOnInteraction: true })]}
      >
        <CarouselContent className="flex gap-5 lg:gap-20 items-center">
          {companies.map(({ id, name, path }) => {
            return (
              <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
                <img
                  src={path}
                  alt={name}
                  className="h-9 sm:h-14 object-contain"
                />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>

      {/* banner */}
      <img
        src="./banner.jpeg"
        className="w-full"
        alt="Hirrd banner... A person holding phone"
      />

      {/* cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            Search and apply for jobs, track applications and more
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>For Employers</CardTitle>
          </CardHeader>
          <CardContent>
            Post jobs, manage applications, and find the best candidate
          </CardContent>
        </Card>
      </section>
      {/* Accordion */}
      <Accordion type="single" collapsible>
        {faqs.map(({ question, answer }, index) => {
          return (
            <AccordionItem value={`item-${index+1}`} key={index}>
              <AccordionTrigger>{question}</AccordionTrigger>
              <AccordionContent>{answer}</AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </main>
  );
};

export default LandingPage;
