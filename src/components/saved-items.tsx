import React from 'react';
import { useSavedItems } from '@/contexts/SavedItemsContext';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Minus } from 'lucide-react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const SavedItemsList: React.FC = () => {
  const { savedItems, removeItem, updateQuantity } = useSavedItems();

  const totalAmount = savedItems.reduce((sum, item) => sum + (item.listedPrice || 0) * item.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption className="mb-3">Manage your saved items</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Image</TableHead>
              <TableHead>Article ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">Quantity</TableHead>
              <TableHead className="hidden md:table-cell">Total</TableHead>
              <TableHead className="hidden md:table-cell">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {savedItems.map((item, index) => (
              <TableRow key={item.id} className={index % 2 === 1 ? 'bg-muted/20' : ''}>
                <TableCell className="hidden sm:table-cell">
                  <Image
                    alt="Product image"
                    className="aspect-square rounded-md object-cover"
                    height="64"
                    src={"/testproduct.jpg"}
                    width="64"
                  />
                </TableCell>
                <TableCell className="font-medium">{item.productId}</TableCell>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.listedPrice} €</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                      className="w-16 text-center"
                    />
                  </div>
                </TableCell>
                <TableCell>{((item.listedPrice || 0) * item.quantity).toFixed(2)} €</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)}>
                    <Minus className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={5}>Total</TableCell>
              <TableCell className="text-right">{totalAmount.toFixed(2)} €</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </CardContent>
    </Card>
  );
};