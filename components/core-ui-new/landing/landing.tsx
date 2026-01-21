import { ArrowUpRight } from "lucide-react";
import { BigPanel } from "./big-panel";

const Item = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div className="border-2 px-4 py-2 font-bold shadow-xs rounded-2xl text-xs flex items0center justify-center gap-x-0.5 cursor-pointer hover:shadow-md transition-all ease-in-out duration-200 min-w-fit hover:-translate-y-1.5 hover:text-primary hover:border-primary active:text-primary active:border-primary active:-translate-y-1.5">
      {children}
      <ArrowUpRight size={13} />
    </div>
  );
};

export const Landing = () => {
  return (
    <div className="flex flex-col md:px-5 md:py-2 gap-y-2 mb-5 mt-17">
      <BigPanel />
    </div>
  );
};
