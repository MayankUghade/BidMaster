import Link from "next/link";
import { Button } from "../ui/button";
import ItemCard from "./Card";

export default function Dashboard() {
  return (
    <div className="flex flex-col p-2 sm:p-5 lg:container">
      <div className="flex sm:flex-row flex-col items-center justify-between w-full mt-3">
        <div>
          <h1 className="font-bold text-3xl">Latest Bids</h1>
        </div>

        <div className="flex gap-2 mt-2">
          <Button>Your Items</Button>
          <Link href="/item/create">
            <Button>New Auction</Button>
          </Link>
        </div>
      </div>

      <div className="p-5 mt-3">
        <ItemCard />
      </div>
    </div>
  );
}
