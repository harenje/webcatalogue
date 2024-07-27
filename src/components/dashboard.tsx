"use client"

import Link from "next/link"
import {
  CircleUser,
  Home,
  Menu,
  Package,
  Package2,
  Search,
  ShoppingCart,
  MoreHorizontal,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { SearchProductCard } from "@/components/search-product-card"
import { SavedItemsList } from "@/components/saved-items"
import { useCallback, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter, useSearchParams } from "next/navigation"
import { useSavedItems } from "@/contexts/SavedItemsContext";
import { useDebounce } from 'use-debounce';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs" 

import { Product } from "@prisma/client";
import Image from "next/image"




interface ProductTableProps {
  products: Product[];
  total: number;
}

interface HomeDashboardProps {
  data: any;
  user: {id: number, userId: string, role: string};
  products: any[];
  total: number;
  currentPage: number;
  pageSize: number;
}



export function HomeDashboard({ data, user, products, total, currentPage, pageSize }: HomeDashboardProps) {

  const { addItem } = useSavedItems()

  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  const [activeTab, setActiveTab] = useState<'all' | 'saved' | 'search'>('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 300);
  const { savedItems } = useSavedItems();

  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (newPage: number) => {
    router.push(`/?page=${newPage}`);
  };

  const getPageNumbers = () => {
    const pageNumbers = [];
    const totalPagesToShow = 5;

    if (totalPages <= totalPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      if (currentPage > 3) {
        pageNumbers.push('...');
      }

      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pageNumbers.push(i);
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push('...');
      }

      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    if (event.target.value) {
      setActiveTab('search');
    } else if (activeTab === 'search') {
      setActiveTab('all');
    }
  }, [activeTab]);

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Package2 className="h-6 w-6" />
              <span className="">Catalogue</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <p className="px-3 py-2">Logged in as {data.user.email}</p>
              <Link
                href=""
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-primary"
                onClick={() => setActiveTab('all')}
              >
                <Home className="h-4 w-4" />
                All products
              </Link>
              <Link
                href=""
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                onClick={() => setActiveTab('saved')}
              >
                <ShoppingCart className="h-4 w-4" />
                Saved items
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {savedItems.length}
                </Badge>
              </Link>
              <Link
                href="/contact"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <Package className="h-4 w-4" />
                Contact
              </Link>
            </nav>
          </div>
          {user.role === "admin" && (
            <div className="mt-auto p-4 items-end">
              <Card>
                <CardHeader className="p-2 pt-0 md:p-4">
                  <CardTitle>Admin page</CardTitle>
                </CardHeader>
                <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                  <Link href="/admin">
                    <Button size="sm" className="w-full">
                      Upload excel file
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
  
      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Catalogue</span>
                </Link>
                <Link
                  href="/contact"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 focus:text-foreground text-muted-foreground hover:text-foreground"
                >
                  <Package className="h-5 w-5" />
                  Contact
                </Link>
              </nav>
              {user?.role === "admin" && (
                <div className="mt-auto">
                  <Card>
                    <CardHeader className="p-2 pt-0 md:p-4">
                      <CardTitle>Admin page</CardTitle>
                    </CardHeader>
                    <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                      <Link href="/admin">
                        <Button size="sm" className="w-full">
                          Upload excel file
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              )}
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </form>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full bg-background">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
  
        {/* Main content */}
        <main className="flex-1 overflow-auto p-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'all' | 'saved' | 'search')}>
            <TabsList className="bg-muted/40">
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="saved">Saved Items</TabsTrigger>
              {debouncedSearchTerm && <TabsTrigger value="search">Search Results</TabsTrigger>}
            </TabsList>
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="hidden w-[100px] sm:table-cell">
                          <span className="sr-only">Image</span>
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>ID</TableHead>
                        <TableHead className="hidden md:table-cell">Price(per Piece)</TableHead>
                        <TableHead className="hidden md:table-cell">Discount</TableHead>
                        <TableHead className="hidden md:table-cell">Status</TableHead>
                        <TableHead>
                          <span className="sr-only">Actions</span>
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product: any) => (
                        <TableRow key={product.id}>
                          <TableCell className="hidden sm:table-cell">
                            <Image
                              alt="Product image"
                              className="aspect-square rounded-md object-cover"
                              height="64"
                              src={product.image || "/testproduct.jpg"}
                              width="64"
                            />
                          </TableCell>
                          <TableCell className="font-medium">{product.productName}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{product.productId}</Badge>
                          </TableCell>
                          <TableCell className="hidden md:table-cell">{product.listedPrice} €</TableCell>
                          <TableCell className="hidden md:table-cell">{product.discount} %</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant={product.status === "available" ? "available" : "destructive"}>
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button aria-haspopup="true" size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                  <span className="sr-only">Toggle menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onSelect={() => addItem(product)}>Save this item</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
                <CardFooter>
                  <div className="flex justify-between items-center text-xs text-muted-foreground w-full">
                    <div>
                      Showing{" "}
                      <strong>
                        {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, total)}
                      </strong>{" "}
                      of <strong>{total}</strong> products
                    </div>
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                            onClick={() => handlePageChange(currentPage - 1)}
                          />
                        </PaginationItem>
                        {getPageNumbers().map((pageNumber, index) => (
                          <PaginationItem key={index}>
                            {pageNumber === '...' ? (
                              <PaginationEllipsis />
                            ) : (
                              <PaginationLink
                                href={`/?page=${pageNumber}`}
                                isActive={currentPage === pageNumber}
                                onClick={(e) => {
                                  e.preventDefault();
                                  handlePageChange(pageNumber as number);
                                }}
                              >
                                {pageNumber}
                              </PaginationLink>
                            )}
                          </PaginationItem>
                        ))}
                        <PaginationItem>
                          <PaginationNext
                            className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                            onClick={() => handlePageChange(currentPage + 1)}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="saved">
              <SavedItemsList />
            </TabsContent>
            <TabsContent value="search">
              <SearchProductCard searchTerm={debouncedSearchTerm} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );

}