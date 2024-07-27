
import { HomeDashboard } from "@/components/dashboard";
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import prisma from "@/utils/db";

export default async function Dashboard({ searchParams }: { searchParams: { page?: string } }) {
  const supabase = createClient();

  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/login")

  const user = await prisma.user.findFirst({ where: { userId: data.user.id } })
  if (!user) redirect("/login")

  const files = await supabase.storage.from("excel-files").list("private", {
    limit: 500,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });

  const page = Number(searchParams.page) || 1;
  const pageSize = 10;
  const skip = (page - 1) * pageSize;

  const products = await prisma.product.findMany({
    take: pageSize,
    skip: skip,
  });


  const total = await prisma.product.count();

  return (
    <HomeDashboard
      data={data}
      user={user}
      products={products}
      total={total}
      currentPage={page}
      pageSize={pageSize}
    />
  )
}