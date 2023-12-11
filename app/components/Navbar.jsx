'use client'

import Link from 'next/link';
import { useState } from 'react';
import { FaBars as HamburgerIcon, FaTimes as CloseIcon } from 'react-icons/fa';

const Links = [
  { href: '/', name: 'Home' },
  { href: '/city', name: 'Search' },
  { href: '/city', name: 'City' },
  { href: '/favorites', name: 'Favorites' },
];

const NavLink = ({ href, name }) => (
  <Link href={href} passHref className="text-text-white hover:text-brand-accent text-md lg:text-lg px-4 py-2">
    {name}
  </Link>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="bg-brand-primary text-text-white px-7">
        <div className="container mx-auto h-16 flex items-center justify-between">
          <button
            className="text-2xl text-brand-accent md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            <div className="text-brand-accent block md:hidden sm:flex text-right mb-1 logo-mob">
            <Link href="/"> CITY@AGlance </Link>
            </div>

            {isOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
          <div className="text-xl text-brand-accent hidden md:flex">
          <Link href="/"> CITY@AGlance </Link>
          </div>
          <div className="hidden md:flex">
            {Links.map((link) => (
              <NavLink key={link.name} {...link} />
            ))}
          </div>
          <div className="flex items-center">
          </div>
        </div>

        {isOpen ? (         
          <div className="pb-4 md:hidden">
            <div className="container mx-auto">
              <div className="flex flex-col space-y-5">
                {Links.map((link) => (
                  <NavLink key={link.name} {...link} />
                ))}
              </div>
            
            </div>
            
          </div>
        ) : null}
      </div>
         
    </>
  );
}
