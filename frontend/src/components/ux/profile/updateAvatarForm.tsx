import type { UseQueryResult } from '@tanstack/react-query'
import { useForm } from '@tanstack/react-form'
import { toast } from 'sonner'
import { updateAvatar } from '@/lib/api'
import { Label } from '@radix-ui/react-label'
import { Input } from '../../ui/input'
import { Button } from '../../ui/button'

interface IUpdateAvatarFormProps {
  refetch: UseQueryResult['refetch']
}

export function UpdateAvatarForm({ refetch }: IUpdateAvatarFormProps) {
  const form = useForm({
    defaultValues: {
      avatar: null,
    },
    onSubmit: async ({ value }) => {
      const formData = new FormData()
      value.avatar && formData.set('avatar', value.avatar)
      try {
        await updateAvatar(formData)
        toast.success('Profile photo updated successfully', {
          style: {
            background: 'DarkGrey',
          },
        })
        refetch()
      } catch (error) {
        toast.error('Failed to update your profile photo', {
          style: {
            background: 'IndianRed',
          },
        })
      }
    },
  })

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
                  onChange={async (e) => {
                    if (e.target.files?.[0]) {
                      form.setFieldValue('avatar', e.target.files[0] as any)
                    }
                  }}
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
