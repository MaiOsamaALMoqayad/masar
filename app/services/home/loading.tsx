import { Skeleton } from "@/components/ui/skeleton"

export default function HomeServicesLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="md:w-2/3">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-5 w-full max-w-md mb-4" />
        </div>
        <div className="md:w-1/3">
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>

        <div className="md:w-3/4">
          <div className="flex justify-between items-center mb-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-10 w-[180px]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="border rounded-lg overflow-hidden">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-1" />
                    <Skeleton className="h-4 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-1/3 mb-2" />
                    <Skeleton className="h-4 w-2/3 mb-3" />
                    <div className="flex gap-1 mb-2">
                      <Skeleton className="h-6 w-24 rounded-full" />
                      <Skeleton className="h-6 w-28 rounded-full" />
                      <Skeleton className="h-6 w-32 rounded-full" />
                    </div>
                    <div className="flex justify-between pt-4">
                      <Skeleton className="h-9 w-28" />
                      <Skeleton className="h-9 w-28" />
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
