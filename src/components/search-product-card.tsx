import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import Image from "next/image";
import { useSavedItems } from "@/contexts/SavedItemsContext";
import { useProductSearch } from '@/hooks/useProductSearch';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

interface SearchProductCardProps {
  searchTerm: string;
}

export function SearchProductCard({ searchTerm }: SearchProductCardProps) {
  const { addItem } = useSavedItems();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading, isError } = useProductSearch(searchTerm, currentPage, pageSize);

  if (isLoading) return <div className="h-[600px] w-full flex items-center justify-center">Loading...</div>;
  if (isError) return <div className="h-[600px] w-full flex items-center justify-center">Error searching products</div>;

  const products = data?.products || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const totalAmount = products.reduce((sum, product) => sum + (product.listedPrice || 0), 0);

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

  const showPagination = total > 0 && totalPages > 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search Results for &quot;{searchTerm}&quot;</CardTitle>
      </CardHeader>
      <CardContent>
        {total > 0 ? (
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
                <TableHead className="hidden md:table-cell">Actions</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product, index) => (
                <TableRow key={product.id} className={index % 2 === 1 ? 'bg-muted/20' : ''}>
                  <TableCell className="hidden sm:table-cell">
                    <Image
                      alt="Product image"
                      className="aspect-square rounded-md object-cover"
                      height="64"
                      src={"/testproduct.jpg"}
                      width="64"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.productName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.productId}</Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{product.listedPrice} €</TableCell>
                  <TableCell className="hidden md:table-cell">{product.discount} %</TableCell>
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
        ) : (
          <div className="text-center py-4">No results found for &quot;{searchTerm}&quot;</div>
        )}

      </CardContent>
      <CardFooter>
      <div className="flex justify-between items-center text-xs text-muted-foreground w-full">
          {total > 0 ? (
            <>
              <div>
                Showing{" "}
                <strong>
                  {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, total)}
                </strong>{" "}
                of <strong>{total}</strong> products
              </div>
              {showPagination && (
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                      />
                    </PaginationItem>
                    {getPageNumbers().map((pageNumber, index) => (
                      <PaginationItem key={index}>
                        {pageNumber === '...' ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            isActive={currentPage === pageNumber}
                            onClick={() => handlePageChange(pageNumber as number)}
                          >
                            {pageNumber}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </>
          ) : (
            <div>No results found</div>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
