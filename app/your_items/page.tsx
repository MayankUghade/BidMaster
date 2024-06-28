import Image from "next/image";
import { fetchYourPosts } from "./actions";
import ItemCard from "@/components/Dashboard/Card";
import { Button } from "@/components/ui/button"; // Correct import for Button component
import Link from "next/link";

export default async function Page() {
  const items = await fetchYourPosts();

  return (
    <div className="p-5 lg:container">
      <h1 className="font-bold text-3xl">Your Items</h1>
      {items?.length > 0 ? (
        <div className="p-3 mt-3 grid md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.id} className="sm:ml-5 sm:mt-4 mt-5">
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3 items-center justify-center mt-7">
          <h1 className="font-bold text-2xl">You haven't created any items</h1>
          <Image
            src="/Empty_state.jpg"
            alt="No items"
            width={400}
            height={500}
          />
          <Button asChild>
            <Link href="/item/create">Create an Item</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
