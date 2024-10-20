import { Card, CardContent } from '../../../ui/card'
import { Skeleton } from '../../../ui/skeleton'

export function ContactSkeleton() {
  return (
    <li className="my-1">
      <Card className="bg-background border-background">
        <CardContent className="p-3">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[110px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </li>
  )
}
