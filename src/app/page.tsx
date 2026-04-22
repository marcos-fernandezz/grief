import HomeClient from "./HomeClient";
import ProductGrid from "@/components/ProductGrid";

export default function Page({ searchParams }: { searchParams: any }) {
  return (
    <HomeClient>
      <ProductGrid searchParams={searchParams} />
    </HomeClient>
  );
}