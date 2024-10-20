import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function MessageSkeleton() {
  return (
    <li className="my-1">
      <Card className="bg-background border-background flex px-2">
        <CardContent className="p-3 grow">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[110px]" />
            </div>
          </div>
        </CardContent>
      </Card>
    </li>
  )
}
