import { $getRoot, $createParagraphNode, $createTextNode } from 'lexical';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { CollaborationPlugin } from '@lexical/react/LexicalCollaborationPlugin';
import * as Y from 'yjs';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';

import { WebsocketProvider } from 'y-websocket';

// const awareness = WebsocketProvider.aw

// import { LexicalEditor } from 'lexical';

function initialEditorState() {
  const root = $getRoot();
  const paragraph = $createParagraphNode();
  const text = $createTextNode('Welcome to collab!');
  paragraph.append(text);
  root.append(paragraph);
}

export function Editor() {
  const initialConfig = {
    // NOTE: This is critical for collaboration plugin to set editor state to null. It
    // would indicate that the editor should not try to set any default state
    // (not even empty one), and let collaboration plugin do it instead
    editorState: null,
    namespace: 'Demo',
    nodes: [],
    onError: (error: Error) => {
      throw error;
    },
    theme: {},
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <PlainTextPlugin
        contentEditable={<ContentEditable />}
        placeholder={<div>Enter some text...</div>}
        ErrorBoundary={LexicalErrorBoundary}
      />
      <CollaborationPlugin
        id="yjs-plugin"
        providerFactory={(id, yjsDocMap) => {
          const doc = new Y.Doc();
          yjsDocMap.set(id, doc);

          const provider = new WebsocketProvider(
            'ws://localhost:1234',
            id,
            doc
          );

          return provider;
        }}
        username="test"
        cursorColor="red"
        awarenessData={
          {
            //   name: 'Emmanuelle Charpentier',
            // Define a color that should be associated to the user:
            //   color: '#ffb61e',
          }
        }
        // Optional initial editor state in case collaborative Y.Doc won't
        // have any existing data on server. Then it'll user this value to populate editor.
        // It accepts same type of values as LexicalComposer editorState
        // prop (json string, state object, or a function)
        // initialEditorState={initialEditorState}
        shouldBootstrap={true}
      />
    </LexicalComposer>
  );
}
