import Link from "next/link"
import { Fuel, ShoppingBag, Utensils, AmbulanceIcon as FirstAid, Car, Home, Wifi, Truck } from "lucide-react"

const categories = [
  {
    name: "Gas Stations",
    icon: Fuel,
    color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
    href: "/services/gas-stations",
  },
  {
    name: "Grocery Stores",
    icon: ShoppingBag,
    color: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
    href: "/services/grocery-stores",
  },
  {
    name: "Restaurants",
    icon: Utensils,
    color: "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
    href: "/services/restaurants",
  },
  {
    name: "Medical Services",
    icon: FirstAid,
    color: "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400",
    href: "/services/medical",
  },
  {
    name: "Auto Services",
    icon: Car,
    color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
    href: "/services/auto",
  },
  {
    name: "Home Services",
    icon: Home,
    color: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
    href: "/services/home",
  },
  {
    name: "Internet & Tech",
    icon: Wifi,
    color: "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/40 dark:text-indigo-400",
    href: "/services/tech",
  },
  {
    name: "Delivery",
    icon: Truck,
    color: "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/40 dark:text-yellow-400",
    href: "/services/delivery",
  },
]

export default function ServiceCategories() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {categories.map((category) => (
        <Link
          key={category.name}
          href={category.href}
          className="flex flex-col items-center gap-3 p-6 rounded-xl border bg-background hover:bg-muted/50 transition-all duration-300 hover:shadow-md hover:-translate-y-1 group"
        >
          <div className={`p-4 rounded-full ${category.color} transition-transform duration-300 group-hover:scale-110`}>
            <category.icon className="h-6 w-6" />
          </div>
          <span className="text-sm font-medium text-center">{category.name}</span>
        </Link>
      ))}
    </div>
  )
}
