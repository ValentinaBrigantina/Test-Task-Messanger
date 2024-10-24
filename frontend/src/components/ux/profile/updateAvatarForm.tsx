import { useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { updateAvatar, userQueryOptions } from '@/lib/api'
import { Label } from '@radix-ui/react-label'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'

export function UpdateAvatarForm() {
  const { refetch } = useQuery(userQueryOptions)

  const inputRef = useRef<HTMLInputElement>(null)

  const form = useForm({
    defaultValues: {
      avatar: null as File | null,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData()
      value.avatar && formData.set('avatar', value.avatar)
      try {
        await updateAvatar(formData)

        form.setFieldValue('avatar', null)
        if (inputRef.current) {
          inputRef.current.value = ''
        }

        toast.success('Profile photo updated successfully')
        refetch()
      } catch (error) {
        toast.error('Failed to update your profile photo')
      }
    },
  })

  const handleOnChange = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
      form.setFieldValue('avatar', file)
    }
  }

  return (
    <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
      <form
        className="max-w-xl m-auto"
        onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          form.handleSubmit()
        }}
      >
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form.Field
            name="avatar"
            children={(field) => (
              <>
                <Label htmlFor={field.name}>Update your profile photo</Label>
                <Input
                  className="block ring-1 ring-inset ring-gray-300"
                  id={field.name}
                  name={field.name}
                  type="file"
                  required
                  onChange={handleOnChange}
                  ref={inputRef}
                />
              </>
            )}
          />
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <Button
              className="flex w-full mt-8"
              type="submit"
              disabled={!canSubmit}
            >
              {isSubmitting ? '...' : 'Update photo'}
            </Button>
          )}
        />
      </form>
    </div>
  )
}
