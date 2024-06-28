import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Item } from "@prisma/client";
import Link from "next/link";
import { formatDistance, isAfter } from "date-fns";
import { fetchUser } from "@/actions/user";

interface ItemCardProps {
  item: Item;
}

export default async function ItemCard({ item }: ItemCardProps) {
  const user = await fetchUser(item.userEmail);
  const isBidEnded = isAfter(new Date(), new Date(item.endDate));

  return (
    <Card className="w-full max-w-lg">
      <Carousel className="rounded-t-lg overflow-hidden relative">
        <CarouselContent>
          {item.images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="p-1 sm:h-[300px] sm:w-lg">
                <img
                  src={image}
                  alt={`Item Image ${index + 1}`}
                  className="object-cover w-full"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
      </Carousel>
      <CardContent className="p-6 grid gap-4">
        <div className="flex  items-center gap-4">
          <Avatar className="border w-10 h-10">
            <AvatarImage src={user?.image || "/placeholder-user.jpg"} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <div className="font-semibold">{user?.firstName}</div>
            <div className="text-sm text-muted-foreground">
              Listed {new Date(item.createdAt).toDateString()}
            </div>
          </div>
        </div>
        <div className="grid gap-2">
          <h3 className="text-xl font-semibold">{item.item}</h3>
          <p className="text-sm text-muted-foreground">{item.description}</p>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">${item.price}</div>
          <div className="text-sm text-muted-foreground">
            Ends:{" "}
            {formatDistance(new Date(), new Date(item.endDate), {
              addSuffix: true,
            })}
          </div>
        </div>
        {isBidEnded ? (
          <Button className="w-full" variant="destructive">
            <Link href={`/item/${item.id}`}>Bidding Over</Link>
          </Button>
        ) : (
          <Button className="w-full" asChild>
            <Link href={`/item/${item.id}`}>Place Bid</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
