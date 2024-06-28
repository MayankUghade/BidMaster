"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { createBid } from "./actions";
import type { Item, Bid } from "@prisma/client";
import { useToast } from "@/components/ui/use-toast";
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs";

const formSchema = z.object({
  bid_amount: z.number().min(1, {
    message: "Bid amount must be at least $1",
  }),
});

export default function Bid({
  itemId,
  item,
  price,
}: {
  itemId: string;
  item: Item & { bid: Bid[] };
  price: number;
}) {
  const { user } = useKindeBrowserClient();
  const userEmail = user?.email as string;
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      bid_amount: 0,
    },
  });

  const currentDate = new Date();
  const isBidEnded = new Date(item.endDate) <= currentDate;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const bids = item.bid || [];
    const maximumBid =
      bids.length > 0
        ? Math.max(...bids.map((bid: any) => bid.bid_amount))
        : price;
    setLoading(true);

    try {
      if (
        (maximumBid === item.price && values.bid_amount >= maximumBid) ||
        values.bid_amount > maximumBid
      ) {
        await createBid(values, userEmail, itemId);
        form.reset();
      } else {
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description:
            "The bid amount should be more than the current maximum bid or the starting price.",
        });
      }
    } catch (error) {
      console.error("Error submitting bid:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog>
      {item.userEmail === userEmail ? (
        <Button disabled>You can't bid on your own listing</Button>
      ) : isBidEnded ? (
        <Button disabled>Bidding has ended</Button>
      ) : (
        <DialogTrigger asChild>
          <Button>Create a Bid</Button>
        </DialogTrigger>
      )}

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Place a Bid</DialogTitle>
          <DialogDescription>
            Enter the amount you would like to bid on this item.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="bid_amount"
                render={({ field }) => (
                  <FormItem>
                    <Label htmlFor="bid-amount" className="text-right">
                      Bid Amount
                    </Label>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="$100"
                        value={field.value}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormDescription>
                      Add the price at which you want to bid
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                {loading ? (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                ) : (
                  <Button type="submit">Place Bid</Button>
                )}
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
