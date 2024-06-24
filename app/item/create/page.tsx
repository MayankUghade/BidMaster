import { AuctionForm } from "./form";

export default function page() {
  return (
    <div className="p-2 sm:p-5 lg:container border mt-6 rounded-sm">
      <h1 className="text-3xl font-bold mb-5">Create A new Auction</h1>
      <AuctionForm />
    </div>
  );
}
