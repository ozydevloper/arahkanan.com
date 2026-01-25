import { MenuIcon, SidebarClose } from "lucide-react";
import { useState } from "react";
import { ClassNameValue } from "tailwind-merge";
import { Portal } from "../portal";
import LogoApp from "../logo-app";
import { ItemsMenu } from "./items";

export default function Menu({ className }: { className: ClassNameValue }) {
  const [onMenu, setOnMenu] = useState(false);
  return (
    <div className={`p-0.5 md:hidden ${className} min-w-fit`}>
      <MenuIcon size={15} onClick={() => setOnMenu(!onMenu)} />
      <Portal typeFor="menuSide" onOpen={onMenu} show={"right"}>
        <div
          className={`w-full bg-primary-foreground text-base flex flex-col items-end justify-start px-5 pt-10`}
        >
          <div className="w-full flex items-center justify-between border-b pb-5 ">
            <LogoApp />
            <SidebarClose
              className="size-5"
              onClick={() => setOnMenu(!onMenu)}
            />
          </div>
          <ItemsMenu />
        </div>
      </Portal>
    </div>
  );
}
