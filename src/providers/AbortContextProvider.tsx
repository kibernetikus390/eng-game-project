import { useState } from "react";
import { AbortContext } from "../contexts/AbortContext";

export function AbortContextProvider({
  children,
  ...props
}: React.PropsWithChildren) {
  const [abort, setStateAbort] = useState<boolean>(false);

  function setAbort(newAbort: boolean) {
    setStateAbort(newAbort);
  }
  
  function isAbort() {
    return abort;
  }

  return (
    <AbortContext.Provider
      value={{
        abort: abort,
        setAbort: setAbort,
        isAbort: isAbort,
      }}
      {...props}
    >
      {children}
    </AbortContext.Provider>
  );
}
