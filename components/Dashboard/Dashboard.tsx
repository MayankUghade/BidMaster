import Link from "next/link";
import { Button } from "../ui/button";
import ItemCard from "./Card";
import { FetchBids } from "@/actions/fetchPosts";
import { Item } from "@prisma/client";

export default async function Dashboard() {
  let items: Item[] = [];

  try {
    items = await FetchBids();
  } catch (error) {
    console.error("Error fetching bids:", error);
  }

  return (
    <div className="flex flex-col p-2 sm:p-5 lg:container">
      <div className="flex sm:flex-row flex-col items-center justify-between w-full mt-3">
        <div>
          <h1 className="font-bold text-3xl">Latest Bids</h1>
        </div>

        <div className="flex gap-2 mt-2">
          <Button>Your Items</Button>
          <Link href="/item/create" passHref>
            <Button>New Auction</Button>
          </Link>
        </div>
      </div>

      <div className="p-5 mt-3 grid md:grid-cols-2 lg:grid-cols-3">
        {items.length > 0 ? (
          items.map((item: Item) => (
            <div key={item.id} className="sm:ml-5 sm:mt-4 mt-5">
              <ItemCard item={item} />
            </div>
          ))
        ) : (
          <p>No items available</p>
        )}
      </div>
    </div>
  );
}
