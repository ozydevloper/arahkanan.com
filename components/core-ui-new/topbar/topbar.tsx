import LogoApp from "../logo-app";
import { ItemsTopBar } from "./items";
import Menu from "./menu";
import SearchBar from "./searchBar";

const TopBar = () => {
  return (
    <div className="w-full px-2 md:px-10 py-1 md:py-1.5 flex items-center text-center gap-x-5 fixed top-0 bg-white z-2 border">
      <LogoApp className="min-w-fit" />
      <SearchBar className="flex-1 " />
      <Menu className="shrink-0" />
      <ItemsTopBar className="shrink-0" />
    </div>
  );
};

export default TopBar;
