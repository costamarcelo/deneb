/**
 * ============================================================================================================================
 *  Core API
 * ============================================================================================================================
 */
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

/**
 * ============================================================================================================================
 *  Included features
 * ============================================================================================================================
 * In order to keep the package size down, we only include the features from Monaco that we actually want (or are known to work, given some
 * of the sandboxing limitations of Power BI visuals). This list needs to be checked/scrutinized each time we update the bundled version of
 * Monaco.
 */
/* browser core commands */
import 'monaco-editor/esm/vs/editor/browser/coreCommands';
/* anchor select */
import 'monaco-editor/esm/vs/editor/contrib/anchorSelect/browser/anchorSelect';
/* bracket matching */
import 'monaco-editor/esm/vs/editor/contrib/bracketMatching/browser/bracketMatching';
/* code editor */
import 'monaco-editor/esm/vs/editor/browser/widget/codeEditorWidget';
/* color picker */
import 'monaco-editor/esm/vs/editor/contrib/colorPicker/browser/colorContributions';
import 'monaco-editor/esm/vs/editor/contrib/colorPicker/browser/standaloneColorPickerActions';
/* comment */
import 'monaco-editor/esm/vs/editor/contrib/comment/browser/comment';
/* context menu */
import 'monaco-editor/esm/vs/editor/contrib/contextmenu/browser/contextmenu';
/* drag and drop */
import 'monaco-editor/esm/vs/editor/contrib/dnd/browser/dnd';
/* document symbols */
import 'monaco-editor/esm/vs/editor/contrib/documentSymbols/browser/documentSymbols';
/* find */
import 'monaco-editor/esm/vs/editor/contrib/find/browser/findController';
/* folding */
import 'monaco-editor/esm/vs/editor/contrib/folding/browser/folding';
/* font zoom */
import 'monaco-editor/esm/vs/editor/contrib/fontZoom/browser/fontZoom';
/* format */
import 'monaco-editor/esm/vs/editor/contrib/format/browser/formatActions';
/* go to error */
import 'monaco-editor/esm/vs/editor/contrib/gotoError/browser/gotoError';
/* go to line */
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoLineQuickAccess';
/* go to symbol */
import 'monaco-editor/esm/vs/editor/contrib/gotoSymbol/browser/goToCommands';
import 'monaco-editor/esm/vs/editor/contrib/gotoSymbol/browser/link/goToDefinitionAtPosition';
/* hover */
import 'monaco-editor/esm/vs/editor/contrib/hover/browser/hover';
/* indentation */
import 'monaco-editor/esm/vs/editor/contrib/indentation/browser/indentation';
/* inlay hints */
import 'monaco-editor/esm/vs/editor/contrib/inlayHints/browser/inlayHintsContribution';
/* lines operations */
import 'monaco-editor/esm/vs/editor/contrib/linesOperations/browser/linesOperations';
/* line selection */
import 'monaco-editor/esm/vs/editor/contrib/lineSelection/browser/lineSelection';
/* long lines helper */
import 'monaco-editor/esm/vs/editor/contrib/longLinesHelper/browser/longLinesHelper';
/* multi-cursor */
import 'monaco-editor/esm/vs/editor/contrib/multicursor/browser/multicursor';
/* quick command */
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneCommandsQuickAccess';
/* quick help */
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneHelpQuickAccess';
/* quick outline */
import 'monaco-editor/esm/vs/editor/standalone/browser/quickAccess/standaloneGotoSymbolQuickAccess';
/* suggest */
import 'monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestController';
import 'monaco-editor/esm/vs/editor/contrib/suggest/browser/suggestInlineCompletions';
/* toggle high contrast */
import 'monaco-editor/esm/vs/editor/standalone/browser/toggleHighContrast/toggleHighContrast';
/* toggle tab focus mode */
import 'monaco-editor/esm/vs/editor/contrib/toggleTabFocusMode/browser/toggleTabFocusMode';
/* tokenization */
import 'monaco-editor/esm/vs/editor/contrib/tokenization/browser/tokenization';
/* unicode highlighter */
import 'monaco-editor/esm/vs/editor/contrib/unicodeHighlighter/browser/unicodeHighlighter';
/* unusual line terminators */
import 'monaco-editor/esm/vs/editor/contrib/unusualLineTerminators/browser/unusualLineTerminators';
/* word highlighter */
import 'monaco-editor/esm/vs/editor/contrib/wordHighlighter/browser/wordHighlighter';

/**
 * ============================================================================================================================
 *  Language features
 * ============================================================================================================================
 * The language services that we wish to bundle. Note that as we only really need JSON support, we want to make sure that we don't import
 * superfluous ones.
 */
import 'monaco-editor/esm/vs/language/json/monaco.contribution';

export { monaco };
