import { Card } from "@/components/ui/card";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { Microchip } from "lucide-react";
import Link from 'next/link'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
     <Card className='m-4 p-3 max-w-2xl md:mx-auto rounded-2xl '>
      <div className="text-2xl flex justify-center items-center gap-2">ESP - PIX <Microchip /></div>
    <Menubar>
  <MenubarMenu>
    <Link href="/dashboard">
    <MenubarTrigger>Dashboard</MenubarTrigger>
    </Link>
    <Link href="/product">
    <MenubarTrigger>Produtos</MenubarTrigger>
    </Link>
    <MenubarTrigger>Conf</MenubarTrigger>
  </MenubarMenu>
</Menubar>
        {children}
     </Card>    
  );
}
