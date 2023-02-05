/** Fiction grammar typings. */

export interface TellAction {
  passage: JSX.Element;
}

export interface PromptAction<Choice extends string> {
  passage: JSX.Element;
  choices: {
    [k in Choice]?: JSX.Element;
  };
}

// TODO CH consider a default Ending type of void?
export type PageSequence<Ending = JSX.Element> = Generator<
  TellAction | PromptAction<any> | JSX.Element, // raw static JSX - syntactic sugar for embedding in a tell
  Ending,
  any
>;

/** Fiction UI typings */

export interface TellProps {
  passage: JSX.Element;
  nextPage: () => void;
}

export interface PromptProps<Choice extends string> {
  passage: JSX.Element;
  choices: {
    [k in Choice]?: JSX.Element;
  };
  handleChoice: (choice: Choice) => void;
}

export interface PageElementDefs {
  Tell: (props: TellProps) => JSX.Element;
  Prompt: <Choice extends string>(props: PromptProps<Choice>) => JSX.Element;
}
