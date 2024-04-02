import { Extension } from "@tiptap/core";
import "@tiptap/extension-text-style";

export type UppercaseOptions = {
  types: string[];
};

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      toggleUppercase: () => ReturnType;
    };
  }
}

export const Uppercase = Extension.create<UppercaseOptions>({
  name: "",

  addOptions() {
    return {
      types: ["textStyle"],
    };
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          uppercase: {
            default: null,
            renderHTML: (attributes) => {
              if (!attributes.uppercase) {
                return {};
              }

              return {
                style: "text-transform: uppercase",
              };
            },
            parseHTML: (element) => {
              return {
                uppercase: element.style.textTransform === "uppercase",
              };
            },
          },
        },
      },
    ];
  },

  addCommands() {
    return {
      toggleUppercase:
        () =>
        ({ chain, editor }) => {
          const isActive = editor.isActive("textStyle", { uppercase: true });
          if (isActive) {
            return chain().setMark("textStyle", { uppercase: null }).run();
          }

          return chain().setMark("textStyle", { uppercase: true }).run();
        },
    };
  },
});