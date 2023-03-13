export declare global {
  interface StorybookGlobals {
    globals: Record<string, any>;
  }
  const __STORYBOOK_CLIENT_API__:
    | undefined
    | {
        storyStore: {
          globals: StorybookGlobals;
        };
      };
  const __STORYBOOK_PREVIEW__:
    | undefined
    | {
        channel: {
          addListener(
            eventName: "updateGlobals" | "setGlobals",
            callback: (globals: StorybookGlobals) => void
          ): this;
          removeListener(
            eventName: "updateGlobals" | "setGlobals",
            callback: (globals: StorybookGlobals) => void
          ): this;
        };
      };
}
