import Link from 'next/link';

export default function Footer() {
  return (
    <div className="bg-brand-lightGray text-gray-600 text-sm py-4 text-center">
      <p>
        Developed by{' '}
        <a
          href="https://github.com/monicalaura"
          className="text-brand-secondary"
          target="_blank"
          rel="noopener noreferrer"
        >
          Monica Laura
        </a>
      </p>
      <p className="text-text-soft mt-1">&copy; 2023. All rights reserved.</p>
    </div>
  );
}
