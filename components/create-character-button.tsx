"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"
import { Loader2, Plus } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import axios from "axios"

const characterFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(255, "Description must be less than 255 characters"),
  avatar: z.string().min(1, "Avatar URL is required"),
  story: z.string().min(1, "Story is required"),
  personality: z.string().min(1, "Personality is required"),
})

type CharacterFormValues = z.infer<typeof characterFormSchema>

export function CreateCharacterButton() {
  const [open, setOpen] = useState(false)
  const form = useForm<CharacterFormValues>({
    resolver: zodResolver(characterFormSchema),
    defaultValues: {
      name: "",
      description: "",
      avatar: "",
      story: "",
      personality: "",
    },
  })

  async function onSubmit(data: CharacterFormValues) {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/character/create`, data, {
        withCredentials: true,
      })

      if (response.status !== 200) {
        throw new Error("Failed to create character")
      }
      form.reset()
      setOpen(false)
    } catch (error) {
      console.error("Error creating character:", error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="gap-2">
          <Plus className="h-4 w-4" />
          Create Character
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[500px] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <DialogTitle>Create New Character</DialogTitle>
          <DialogDescription>
            Create a new AI character to chat with.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh] px-6 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter character name" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      The name of your AI character.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of your character"
                        className="resize-none h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      A short description of your character's appearance and basic traits.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Avatar URL</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter avatar image URL" {...field} />
                    </FormControl>
                    <FormDescription className="text-xs">
                      A URL to your character's avatar image.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="story"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Backstory</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your character's background story"
                        className="resize-none h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      The detailed background story of your character.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personality</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your character's personality traits"
                        className="resize-none h-24"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs">
                      Describe how your character thinks, behaves, and interacts.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <div className="flex justify-end gap-4 px-6 py-4 border-t">
          <Button variant="outline" type="button" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
            {form.formState.isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create Character"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
