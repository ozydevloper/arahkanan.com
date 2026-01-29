import { useAgendas } from "@/lib/zustand";
import LogoApp from "../logo-app";
import { Portal } from "../portal";
import { PublishingBox } from "../publishing-box";
import { ItemsTopBar } from "./items";
import Menu from "./menu";
import SearchBar from "./searchBar";

const TopBar = () => {
  const onPublishing = useAgendas((state) => state.onPublishing);
  const setOnPublishing = useAgendas((state) => state.setOnPublishing);

  return (
    <div className="w-full px-2 md:px-10 py-1 md:py-1.5 flex items-center text-center gap-x-5 fixed top-0 bg-white z-2 border">
      <Portal onOpen={onPublishing} show="top" typeFor="publish">
        {onPublishing && (
          <PublishingBox onClick={() => setOnPublishing(!onPublishing)} />
        )}
      </Portal>
      <LogoApp className="min-w-fit" />
      <SearchBar className="flex-1 " />
      <Menu className="shrink-0" />
      <ItemsTopBar className="shrink-0" />
    </div>
  );
};

export default TopBar;
