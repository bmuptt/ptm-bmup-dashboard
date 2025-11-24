<!-- eslint-disable vue/no-template-shadow -->
<template>
  <div class="tiptap-editor">
    <div
      v-if="!hideToolbar"
      class="toolbar"
    >
      <!-- Text Formatting Group -->
      <div class="toolbar-group">
        <v-btn
          :variant="editor?.isActive('bold') ? 'flat' : 'text'"
          :color="editor?.isActive('bold') ? 'primary' : 'default'"
          size="small"
          icon="mdi-format-bold"
          :disabled="!editor?.can().chain().focus().toggleBold().run()"
          @click="editor?.chain().focus().toggleBold().run()"
        />
        <v-btn
          :variant="editor?.isActive('italic') ? 'flat' : 'text'"
          :color="editor?.isActive('italic') ? 'primary' : 'default'"
          size="small"
          icon="mdi-format-italic"
          :disabled="!editor?.can().chain().focus().toggleItalic().run()"
          @click="editor?.chain().focus().toggleItalic().run()"
        />
        <v-btn
          :variant="editor?.isActive('underline') ? 'flat' : 'text'"
          :color="editor?.isActive('underline') ? 'primary' : 'default'"
          size="small"
          icon="mdi-format-underline"
          :disabled="!editor?.can().chain().focus().toggleUnderline().run()"
          @click="editor?.chain().focus().toggleUnderline().run()"
        />
        <v-btn
          :variant="editor?.isActive('strike') ? 'flat' : 'text'"
          :color="editor?.isActive('strike') ? 'primary' : 'default'"
          size="small"
          icon="mdi-format-strikethrough"
          :disabled="!editor?.can().chain().focus().toggleStrike().run()"
          @click="editor?.chain().focus().toggleStrike().run()"
        />
      </div>

      <v-divider
        vertical
        class="mx-2"
      />

      <!-- Headings Group -->
      <div class="toolbar-group">
        <v-btn
          :variant="editor?.isActive('heading', { level: 1 }) ? 'flat' : 'text'"
          :color="editor?.isActive('heading', { level: 1 }) ? 'primary' : 'default'"
          size="small"
          icon="mdi-format-header-1"
          @click="editor?.chain().focus().toggleHeading({ level: 1 }).run()"
        />
        <v-btn
          :variant="editor?.isActive('heading', { level: 2 }) ? 'flat' : 'text'"
          :color="editor?.isActive('heading', { level: 2 }) ? 'primary' : 'default'"
          size="small"
          icon="mdi-format-header-2"
          @click="editor?.chain().focus().toggleHeading({ level: 2 }).run()"
        />
        <v-btn
          :variant="editor?.isActive('heading', { level: 3 }) ? 'flat' : 'text'"
          :color="editor?.isActive('heading', { level: 3 }) ? 'primary' : 'default'"
          size="small"
          icon="mdi-format-header-3"
          @click="editor?.chain().focus().toggleHeading({ level: 3 }).run()"
        />
      </div>

      <v-divider
        vertical
        class="mx-2"
      />

      <!-- Lists Group -->
      <div class="toolbar-group">
        <v-btn
          :variant="editor?.isActive('bulletList') ? 'flat' : 'text'"
          :color="editor?.isActive('bulletList') ? 'primary' : 'default'"
          size="small"
          icon="mdi-format-list-bulleted"
          @click="editor?.chain().focus().toggleBulletList().run()"
        />
        <v-btn
          :variant="editor?.isActive('orderedList') ? 'flat' : 'text'"
          :color="editor?.isActive('orderedList') ? 'primary' : 'default'"
          size="small"
          icon="mdi-format-list-numbered"
          @click="editor?.chain().focus().toggleOrderedList().run()"
        />
        <v-btn
          :variant="editor?.isActive('blockquote') ? 'flat' : 'text'"
          :color="editor?.isActive('blockquote') ? 'primary' : 'default'"
          size="small"
          icon="mdi-format-quote-close"
          @click="editor?.chain().focus().toggleBlockquote().run()"
        />
      </div>

      <v-divider
        vertical
        class="mx-2"
      />

      <!-- Alignment Group -->
      <div class="toolbar-group">
        <v-btn
          :variant="editor?.isActive({ textAlign: 'left' }) ? 'flat' : 'text'"
          :color="editor?.isActive({ textAlign: 'left' }) ? 'primary' : 'default'"
          size="small"
          icon="mdi-format-align-left"
          @click="editor?.chain().focus().setTextAlign('left').run()"
        />
        <v-btn
          :variant="editor?.isActive({ textAlign: 'center' }) ? 'flat' : 'text'"
          :color="editor?.isActive({ textAlign: 'center' }) ? 'primary' : 'default'"
          size="small"
          icon="mdi-format-align-center"
          @click="editor?.chain().focus().setTextAlign('center').run()"
        />
        <v-btn
          :variant="editor?.isActive({ textAlign: 'right' }) ? 'flat' : 'text'"
          :color="editor?.isActive({ textAlign: 'right' }) ? 'primary' : 'default'"
          size="small"
          icon="mdi-format-align-right"
          @click="editor?.chain().focus().setTextAlign('right').run()"
        />
        <v-btn
          :variant="editor?.isActive({ textAlign: 'justify' }) ? 'flat' : 'text'"
          :color="editor?.isActive({ textAlign: 'justify' }) ? 'primary' : 'default'"
          size="small"
          icon="mdi-format-align-justify"
          @click="editor?.chain().focus().setTextAlign('justify').run()"
        />
      </div>

      <v-divider
        vertical
        class="mx-2"
      />

      <!-- Code Group -->
      <div class="toolbar-group">
        <v-btn
          :variant="editor?.isActive('code') ? 'flat' : 'text'"
          :color="editor?.isActive('code') ? 'primary' : 'default'"
          size="small"
          icon="mdi-code-tags"
          @click="editor?.chain().focus().toggleCode().run()"
        />
        <v-btn
          :variant="editor?.isActive('codeBlock') ? 'flat' : 'text'"
          :color="editor?.isActive('codeBlock') ? 'primary' : 'default'"
          size="small"
          icon="mdi-code-braces"
          @click="editor?.chain().focus().toggleCodeBlock().run()"
        />
      </div>

      <v-divider
        vertical
        class="mx-2"
      />

      <!-- Link Group -->
      <div class="toolbar-group">
        <v-btn
          :variant="editor?.isActive('link') ? 'flat' : 'text'"
          :color="editor?.isActive('link') ? 'primary' : 'default'"
          size="small"
          icon="mdi-link"
          @click="setLink"
        />
        <v-btn
          v-if="editor?.isActive('link')"
          variant="text"
          size="small"
          icon="mdi-link-off"
          @click="editor?.chain().focus().unsetLink().run()"
        />
      </div>

      <v-divider
        vertical
        class="mx-2"
      />

      <!-- Color Group -->
      <div class="toolbar-group">
        <v-menu>
          <template #activator="{ props }">
            <v-btn
              variant="text"
              size="small"
              icon="mdi-format-color-text"
              v-bind="props"
            />
          </template>
          <v-card>
            <v-card-text class="pa-2">
              <div class="color-palette">
                <div
                  v-for="color in colors"
                  :key="color"
                  class="color-item"
                  :style="{ backgroundColor: color }"
                  @click="setColor(color)"
                />
              </div>
            </v-card-text>
          </v-card>
        </v-menu>
      </div>
    </div>
    <editor-content :editor="editor" />
  </div>
</template>

<script setup lang="ts">
import { useEditor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Link from '@tiptap/extension-link';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';

// Props
interface Props {
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  height?: number;
  hideToolbar?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: 'Start typing...',
  disabled: false,
  height: 200,
  hideToolbar: false
});

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string];
  'change': [value: string];
}>();

// Color palette
const colors = [
  '#000000', '#374151', '#6B7280', '#9CA3AF', '#D1D5DB', '#F3F4F6', '#FFFFFF',
  '#EF4444', '#F97316', '#F59E0B', '#EAB308', '#84CC16', '#22C55E', '#10B981',
  '#14B8A6', '#06B6D4', '#0EA5E9', '#3B82F6', '#6366F1', '#8B5CF6', '#A855F7',
  '#D946EF', '#EC4899', '#F43F5E'
];

// Link functions
const setLink = () => {
  const previousUrl = editor.value?.getAttributes('link').href;
  const url = window.prompt('URL', previousUrl);

  // cancelled
  if (url === null) {
    return;
  }

  // empty
  if (url === '') {
    editor.value?.chain().focus().extendMarkRange('link').unsetLink().run();
    return;
  }

  // update link
  editor.value?.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
};

// Color function
const setColor = (color: string) => {
  editor.value?.chain().focus().setColor(color).run();
};

// Editor instance
const editor = useEditor({
  content: props.modelValue || "<p>Start typing...</p>",
  extensions: [
    StarterKit,
    Underline,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Link.configure({
      openOnClick: false,
    }),
    TextStyle,
    Color,
  ],
  editable: !props.disabled,
  onUpdate: ({ editor }) => {
    const html = editor.getHTML();
    emit('update:modelValue', html);
    emit('change', html);
  },
});
</script>

<style scoped>
.tiptap-editor {
  border: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  border-radius: 4px;
  overflow: hidden;
}

.toolbar {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px;
  background-color: white;
  border-bottom: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  flex-wrap: wrap;
}

.toolbar-group {
  display: flex;
  gap: 2px;
  align-items: center;
}

.color-palette {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  width: 200px;
}

.color-item {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  cursor: pointer;
  border: 1px solid #ccc;
  transition: transform 0.2s;
}

.color-item:hover {
  transform: scale(1.1);
  border-color: #666;
}

/* TipTap content styles */
:deep(.ProseMirror) {
  outline: none;
  min-height: 200px;
  padding: 12px;
  background-color: rgba(var(--v-theme-surface), 1);
  color: rgba(var(--v-theme-on-surface), 1);
}

:deep(.ProseMirror p) {
  margin: 0.5em 0;
}

:deep(.ProseMirror h1) {
  font-size: 2em;
  font-weight: bold;
  margin: 0.67em 0;
}

:deep(.ProseMirror h2) {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.75em 0;
}

:deep(.ProseMirror h3) {
  font-size: 1.17em;
  font-weight: bold;
  margin: 0.83em 0;
}

:deep(.ProseMirror ul),
:deep(.ProseMirror ol) {
  padding-left: 1.5em;
  margin: 1em 0;
}

:deep(.ProseMirror li) {
  margin: 0.25em 0;
}

:deep(.ProseMirror blockquote) {
  border-left: 3px solid rgba(var(--v-theme-primary), 0.5);
  padding-left: 1em;
  margin: 1em 0;
  font-style: italic;
}

:deep(.ProseMirror code) {
  background-color: rgba(var(--v-theme-surface-variant), 1);
  padding: 0.2em 0.4em;
  border-radius: 3px;
  font-family: monospace;
}

:deep(.ProseMirror pre) {
  background-color: rgba(var(--v-theme-surface-variant), 1);
  padding: 1em;
  border-radius: 4px;
  overflow-x: auto;
  margin: 1em 0;
}

:deep(.ProseMirror pre code) {
  background: none;
  padding: 0;
}
</style>
