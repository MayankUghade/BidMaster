"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

import {
  MultiImageDropzone,
  type FileState,
} from "@/components/MutiImageDropzone";
import { useEdgeStore } from "@/utils/edgestore";
import React, { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const formSchema = z.object({
  item: z.string().min(2, {
    message: "Item must be at least 2 characters.",
  }),
  description: z.string().min(5, {
    message: "Item description must be at least 5 characters.",
  }),
  price: z.number().min(1, {
    message: "Item price must be at least 1.",
  }),
  endDate: z.date({
    required_error: "End date is required",
    invalid_type_error: "End date must be a valid date",
  }),
  images: z.array(z.string()).min(1, {
    message: "At least one image is required.",
  }),
});

export function AuctionForm() {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const [date, setDate] = React.useState<Date>();
  const { edgestore } = useEdgeStore();

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item: "",
      description: "",
      price: 1,
      images: [],
      endDate: new Date(),
    },
  });

  async function handleFileUpload(addedFileState: FileState) {
    try {
      const res = await edgestore.publicFiles.upload({
        file: addedFileState.file as File,
        onProgressChange: async (progress) => {
          updateFileProgress(addedFileState.key, progress);
          if (progress === 100) {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            updateFileProgress(addedFileState.key, "COMPLETE");
          }
        },
      });
      return res.url; // Assuming the upload response contains the URL of the uploaded file.
    } catch (err) {
      updateFileProgress(addedFileState.key, "ERROR");
      throw err;
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="item"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item name</FormLabel>
              <FormControl>
                <Input placeholder="Vintage Rolex Submariner" {...field} />
              </FormControl>
              <FormDescription>This is the name of item.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Description</FormLabel>
              <FormControl>
                <Input
                  placeholder="A timeless blend of luxury and durability, the vintage Rolex Submariner"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the description for item.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item price</FormLabel>
              <FormControl>
                <Input type="number" placeholder="10234" {...field} />
              </FormControl>
              <FormDescription>This is the price for item.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Controller
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <Popover>
                      <div className="flex flex-col gap-2">
                        <FormLabel>End Date</FormLabel>
                        <div>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-[280px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {date ? (
                                format(date, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={date}
                              onSelect={setDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </div>
                      </div>
                    </Popover>
                  )}
                />
              </FormControl>
              <FormDescription>Add the auction end date</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Images</FormLabel>
              <FormControl>
                <Controller
                  control={form.control}
                  name="images"
                  render={({ field }) => (
                    <MultiImageDropzone
                      value={fileStates}
                      dropzoneOptions={{
                        maxFiles: 6,
                      }}
                      onChange={(files) => {
                        setFileStates(files);
                      }}
                      onFilesAdded={async (addedFiles) => {
                        setFileStates([...fileStates, ...addedFiles]);
                        const urls = await Promise.all(
                          addedFiles.map(handleFileUpload)
                        );
                        field.onChange([...field.value, ...urls]);
                      }}
                    />
                  )}
                />
              </FormControl>
              <FormDescription>Upload images of the item.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
