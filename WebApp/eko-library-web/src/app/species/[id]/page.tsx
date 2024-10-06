import Link from 'next/link';
import ClientSpeciesInfoComponent from './ClientSpeciesInfoComponent'

export default function Home() {
  

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-white pt-32">
      <Link href="/" passHref>
        <h1 className="text-5xl font-bold text-green-900 mb-8">EkoLibrary</h1>
      </Link>
      <div className="w-full max-w-lg">
        <ClientSpeciesInfoComponent/>
      </div>
    </div>
  );
}
