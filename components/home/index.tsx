import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HomeProps {
    setMode: (mode: string) => void;
}

export default function Home({setMode}: HomeProps) {

    const handleClick = () => {
        setMode('tools')
    }

  return (
    <section className="home flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <img alt="Logo" class="h-16 mb-4" src="/logo.svg"/>
      <div className="w-full max-w-md p-4 bg-white shadow-md rounded-md dark:bg-gray-800">
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2 w-full">
            <Input
              className="w-full border-none focus:ring-0 dark:bg-gray-800 dark:text-gray-200"
              placeholder="What can we help you accomplish..."
              type="text"
            />
            <Button
              className="bg-gray-300 text-white rounded-md py-2 px-4 text-sm font-medium hover:bg-gray-400 dark:bg-gray-100 dark:text-gray-800 dark:hover:bg-gray-200"
              type="submit"
              onClick={handleClick}
            >
              <SearchIcon className="w-5 h-5 text-gray-800 dark:text-gray-400" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function SearchIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}
