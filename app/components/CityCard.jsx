"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { BiBuildingHouse } from "react-icons/bi";
import DeleteCity from "./DeleteCity";

export default function CityCard({ city }) {
  return (
    <div key={city.name} className="relative group">
      <div className="bg-brand-primary rounded-lg overflow-hidden shadow-md text-white favCard relative">
        <div className="placeholder-image">
          <Image
            src="/city-fav-generic.png"
            alt={city.name}
            layout="responsive"
            width={288}
            height={63}
          />
        </div>

        <div className="p-4">
          <h3 className="favName font-bold mb-2 text-brand-accent">
            {city.name}
          </h3>

          <Link
            href={`/favorite-city/${encodeURIComponent(city.name)}`}
            className="text-text-white  group-hover:text-brand-accent page-link absolute bottom-0 left-0 p-2"
          >
            <BiBuildingHouse size={13} className="inline-block mr-1 text-sm " />{" "}
            City Page
          </Link>
        </div>
        <div className="absolute bottom-0 right-0 p-2 flex space-x-2 ">
          {/* Delete */}
          <DeleteCity id={city._id} />
          {console.log("City id:" + city._id)}
        </div>
      </div>
    </div>
  );
}
