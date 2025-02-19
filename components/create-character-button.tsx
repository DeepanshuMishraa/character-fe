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
        <Button variant="secondary" className="gap-2 ">
          <Plus className="h-4 w-4" />
          Create Character
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-0 gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 space-y-2 border-b bg-card">
          <DialogTitle className="text-xl font-semibold tracking-tight">Create New Character</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Design your AI companion's personality and backstory
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-220px)] px-6 py-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter character name"
                        {...field}
                        className="h-10 px-3 py-2"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Choose a memorable name for your AI character
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Brief description of your character"
                        className="min-h-[80px] resize-none px-3 py-2"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Describe your character's key features and traits
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Avatar URL</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter avatar image URL"
                        {...field}
                        className="h-10 px-3 py-2"
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Provide a URL for your character's avatar image
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="story"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Backstory</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Your character's background story"
                        className="min-h-[120px] resize-none px-3 py-2"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Create a rich backstory to give your character depth
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="personality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Personality</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your character's personality traits"
                        className="min-h-[120px] resize-none px-3 py-2"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription className="text-xs text-muted-foreground">
                      Define how your character thinks and behaves
                    </FormDescription>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </ScrollArea>
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-card">
          <Button
            variant="outline"
            type="button"
            onClick={() => setOpen(false)}
            className="bg-background"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
            className="bg-primary/90 hover:bg-primary text-primary-foreground"
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <Plus className="w-4 h-4 mr-2" />
            )}
            Create Character
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
