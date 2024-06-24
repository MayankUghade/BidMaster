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
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export default function Component() {
  return (
    <Card className="w-full max-w-md">
      <Carousel className="rounded-t-lg overflow-hidden">
        <CarouselContent>
          <CarouselItem>
            <div className="p-1">
              <img
                src="/auction.jpg"
                alt="Item Image"
                className="object-cover w-full h-full rounded-t-lg"
              />
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="p-1">
              <img
                src="/auction2.jpg"
                alt="Item Image"
                className="object-cover w-full h-full rounded-t-lg"
              />
            </div>
          </CarouselItem>
          <CarouselItem>
            <div className="p-1">
              <img
                src="/feedback.jpg"
                alt="Item Image"
                className="object-cover w-full h-full rounded-t-lg"
              />
            </div>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
      </Carousel>
      <CardContent className="p-6 grid gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="border w-10 h-10">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="grid gap-0.5">
            <div className="font-semibold">Jared Palmer</div>
            <div className="text-sm text-muted-foreground">
              Listed 2 days ago
            </div>
          </div>
        </div>
        <div className="grid gap-2">
          <h3 className="text-xl font-semibold">Vintage Typewriter</h3>
          <p className="text-sm text-muted-foreground">
            This vintage typewriter is in excellent condition and perfect for
            adding a touch of nostalgia to your home office or workspace.
          </p>
        </div>
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold">$150</div>
          <div className="text-sm text-muted-foreground">
            Auction ends in 5 days
          </div>
        </div>
        <Button className="w-full">Place Bid</Button>
      </CardContent>
    </Card>
  );
}
