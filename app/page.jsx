import Image from 'next/image'
import Link from 'next/link';
import HomeCities from './components/HomeCities';


export default function Home() {
  return (
    <div className="container mx-auto max-w-5xl py-3">
      <div className="flex flex-col items-center justify-center min-h-screen py-2 md:py-3">
        <div className="text-center space-y-4 md:space-y-6 head-text">
          <h1 className="font-semibold text-3xl sm:text-4xl md:text-4xl lg:text-5xl text-brand-primary leading-110 mb-1">
            Explore Your Favorite Cities
          </h1>
          <h2 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl text-brand-accent mb-8">
            Go get them!
          </h2>
          <p className="text-gray-500 max-w-3xl text-lg mb-2 px-5">
           What city makes you happy as soon as you arrive?
          </p>

          <Link href="/city" passHref className="inline-block px-4 py-3 mt-3 bg-brand-accent text-lg text-white hover:bg-brand-primary">
             Find Out
          </Link>
        </div>
        
        <div className="mt-5 sm:mt-6 md:mt-8 max-w-2xl mx-auto">
          <Image
            src="/header.svg"
            alt="Header image"
            layout="responsive"
            width={480}
            height={270}
            className="rounded-lg"
          />
        </div>
      </div>
   {/* HomeCities component */}
   <HomeCities />
    </div>
  );
}
