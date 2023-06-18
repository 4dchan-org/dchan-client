import { OpenedWidgetEnum } from "src/components";
import { useMemo, useState } from "react";
import {
  ThemeContext,
  TimeTravelContextProvider,
  Web3ContextProvider,
} from ".";
import { ModalContext } from "./ModalContext";
import { WidgetContext } from "./WidgetContext";
import subgraphClient from "src/subgraph/client";
import { ApolloProvider } from "@apollo/react-hooks";

export const AppContext = ({
  children,
}: {
  children: JSX.Element[] | JSX.Element;
}) => {
  const modal = useState<string | false>(false);
  const theme = useState<string>("blueboard");
  const widget = useState<OpenedWidgetEnum | null>(null);

  const client = useMemo(() => subgraphClient, []);

  // HADOUKEN
  return (
    <ApolloProvider client={client}>
      <Web3ContextProvider>
        <TimeTravelContextProvider>
          <ThemeContext.Provider value={theme}>
            <ModalContext.Provider value={modal}>
              <WidgetContext.Provider value={widget}>
                {children}
              </WidgetContext.Provider>
            </ModalContext.Provider>
          </ThemeContext.Provider>
        </TimeTravelContextProvider>
      </Web3ContextProvider>
    </ApolloProvider>
  );
};
