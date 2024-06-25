import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { fetchSingleItem } from "./actions";
import Bid from "./bid";
import ItemCard from "@/components/Dashboard/Card";
import { formatDistance } from "date-fns";

interface PageProps {
  params: {
    itemId: string;
  };
}

export default async function Page({ params }: PageProps) {
  const { itemId } = params;
  const item = await fetchSingleItem(itemId);

  if (!item) {
    return <div>Item not found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto p-4 md:p-8">
      <div className="grid gap-4">
        <Carousel>
          <CarouselContent>
            {item.images.map((image, index) => (
              <CarouselItem key={index}>
                <img
                  src={image}
                  alt={`Item ${index + 1}`}
                  width={600}
                  height={400}
                  className="w-full h-auto rounded-lg object-cover"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
          <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
        </Carousel>
        <div className="grid gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">{item.item}</h1>
            <h2 className="text-sm text-muted-foreground">
              Listed {new Date(item.createdAt).toDateString()}
            </h2>
          </div>
          <p className="text-muted-foreground">{item.description}</p>
          <div className="flex items-center justify-between gap-2">
            <div className="text-2xl font-bold">${item.price.toFixed(2)}</div>
            <div className="text-sm text-muted-foreground">
              Ends: {new Date(item.endDate).toLocaleDateString()}
            </div>
          </div>
          <Bid itemId={itemId} item={item} price={item.price} />
        </div>
      </div>
      <div className="grid gap-4 md:gap-10 items-start">
        <ScrollArea className="h-[520px] border rounded-lg">
          <CardHeader>
            <h1 className="font-bold text-2xl">Recent Bids</h1>
          </CardHeader>
          <CardContent>
            <div className="grid gap-5 mt-5">
              {item.bid.map((bid, index) => (
                <div
                  key={index}
                  className="flex items-center gap-5 border-b p-3"
                >
                  <Avatar className="border w-10 h-10">
                    <AvatarImage
                      src={bid.user.image || "/placeholder-user.jpg"}
                    />
                    <AvatarFallback>BM</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="font-medium">{bid.user.name}</div>
                    <div className="text-muted-foreground">
                      ${bid.bid_amount.toFixed(2)}
                    </div>
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {formatDistance(bid.createdAt, new Date(), {
                      addSuffix: true,
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </ScrollArea>
      </div>
    </div>
  );
}
