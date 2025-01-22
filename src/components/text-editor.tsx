import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Toggle } from "ui";
import {
	IconBold,
	IconBulletList,
	IconItalic,
	IconListBullets,
} from "justd-icons";
import { tv } from "tailwind-variants";
import { focusStyles } from "./ui/primitive";

const editorStyles = tv({
	extend: focusStyles,
	base: "field-sizing-content min-h-16 w-full min-w-0 rounded-lg border border-input shadow-xs outline-hidden transition duration-200 data-disabled:opacity-50",
});

export function RichTextEditor() {
	const [isBold, setIsBold] = useState(false);
	const [isItalic, setIsItalic] = useState(false);
	const [isBulletList, setIsBulletList] = useState(false);
	const [isOrderedList, setIsOrderedList] = useState(false);

	const editor = useEditor({
		extensions: [StarterKit],
		content: "<p>Hello, start typing here...</p>",
		onUpdate: ({ editor }) => {
			setIsBold(editor.isActive("bold"));
			setIsItalic(editor.isActive("italic"));
			setIsBulletList(editor.isActive("bulletList"));
			setIsOrderedList(editor.isActive("orderedList"));
		},
	});

	if (!editor) {
		return null;
	}

	return (
		<div className="group flex flex-col gap-y-1.5">
			<div className={editorStyles()}>
				<div className="flex gap-2 p-2 border-b border-input">
					<Toggle
						isSelected={isBold}
						onChange={() => editor.chain().focus().toggleBold().run()}
						aria-label="Toggle bold"
						size="square-petite"
					>
						<IconBold />
					</Toggle>
					<Toggle
						isSelected={isItalic}
						onChange={() => editor.chain().focus().toggleItalic().run()}
						aria-label="Toggle italic"
						size="square-petite"
					>
						<IconItalic />
					</Toggle>
					<Toggle
						isSelected={isBulletList}
						onChange={() => editor.chain().focus().toggleBulletList().run()}
						aria-label="Toggle bullet list"
						size="square-petite"
					>
						<IconBulletList />
					</Toggle>
					<Toggle
						isSelected={isOrderedList}
						onChange={() => editor.chain().focus().toggleOrderedList().run()}
						aria-label="Toggle ordered list"
						size="square-petite"
					>
						<IconListBullets />
					</Toggle>
				</div>
				<EditorContent
					editor={editor}
					className="prose max-w-none min-h-[120px] p-2.5 focus-within:outline-hidden text-base sm:text-sm [&>div>ul]:list-disc [&>div>ul]:ml-4 [&>div>ol]:list-decimal [&>div>ol]:ml-4"
				/>
			</div>
		</div>
	);
}
