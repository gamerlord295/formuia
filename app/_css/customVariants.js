import { Input, Textarea, Button, extendVariants } from "@nextui-org/react";

export const MyInput = extendVariants(Input, {
  variants: {
    color: {
      violet: {
        inputWrapper: [
          "border-2",
          "border-white",
          "group-data-[focus=true]:border-violet-600",
        ],
      },
    },
  },
  defaultVariants: {
    color: "violet",
  },
});

export const MyTextarea = extendVariants(Textarea, {
  variants: {
    color: {
      violet: {
        inputWrapper: [
          "border-2",
          "border-white",
          "group-data-[focus=true]:border-violet-600",
        ],
      },
    },
  },
  defaultVariants: {
    color: "violet",
  },
});

export const MyButton = extendVariants(Button, {
  variants: {
    color: {
      violet:
        "border-2 border-violet-600 bg-violet-600 hover:bg-transparent hover:text-violet-600 text-white font-sans shadow-md shadow-violet-900/50",
    },
  },
  defaultVariants: {
    color: "violet",
  },
});
