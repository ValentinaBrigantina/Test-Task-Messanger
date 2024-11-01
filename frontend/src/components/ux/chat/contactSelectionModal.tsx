import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { IoIosAdd } from 'react-icons/io'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { CreateChannelOfGroupData, UserProfile } from '@server/sharedTypes'
import { Card, CardContent } from '@/components/ui/card'
import { ContactAvatar } from './contactAvatar'
import { createGroupChat } from '@/lib/api'
import { Input } from '@/components/ui/input'

interface IContactSelectionModalProps {
  contacts: UserProfile[]
}

export function ContactSelectionModal({
  contacts,
}: IContactSelectionModalProps) {
  const [open, setOpen] = useState(false)

  const form = useForm({
    defaultValues: {
      contacts: [] as Array<UserProfile>,
      name: '',
    },
    onSubmit: async ({ value }) => {
      if (!value.contacts.length) {
        toast.error('You need to select a contact')
        return
      }
      const data: CreateChannelOfGroupData = {
        contacts: value.contacts.map((contact) => contact.id),
        name: value.name.trim(),
      }
      await createGroupChat(data)
      setOpen(false)
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger>
            <DialogTrigger asChild>
              <div className="size-5 mt-2 bg-primary rounded-full flex justify-center items-center text-primary-foreground hover:bg-primary/90">
                <IoIosAdd className="size-5" />
              </div>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add group channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogDescription></DialogDescription>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center p-2">
            Select the contacts you want to add to the group chat
          </DialogTitle>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <form.Field
            name="name"
            children={(field) => {
              return (
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="Enter the name of the group chat"
                  required
                />
              )
            }}
          />
          {contacts.map((contact) => (
            <form.Field
              key={contact.id}
              name="contacts"
              mode="array"
              children={(field) => (
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={field.state.value?.includes(contact)}
                    onCheckedChange={(checked) => {
                      const newValue = checked
                        ? [...field.state.value, contact]
                        : field.state.value.filter((value) => value !== contact)
                      field.handleChange(newValue)
                    }}
                  />
                  <Label htmlFor={contact.name}>
                    <Card className="bg-background rounded-md border-background">
                      <CardContent className="p-0 m-1">
                        <ContactAvatar user={contact} />
                      </CardContent>
                    </Card>
                  </Label>
                </div>
              )}
            />
          ))}

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                className="mt-4 w-full"
                type="submit"
                disabled={!canSubmit}
              >
                {isSubmitting ? '...' : 'Create group'}
              </Button>
            )}
          />
        </form>
      </DialogContent>
    </Dialog>
  )
}
