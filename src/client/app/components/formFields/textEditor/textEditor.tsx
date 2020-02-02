import * as React from 'react';
import { WrappedFieldProps } from 'redux-form';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import {
  Editor,
  EditorState,
  RichUtils,
  ContentState,
  convertFromHTML,
  DraftEditorCommand,
  DraftBlockType
} from 'draft-js';
import FormatBold from '@material-ui/icons/FormatBold';
import FormatItalic from '@material-ui/icons/FormatItalic';
import FormatUnderlined from '@material-ui/icons/FormatUnderlined';
import FormatUnorderedList from '@material-ui/icons/FormatListBulleted';
import { debounce } from 'lodash';

import { LANGUAGES, DEFAULT_LANGUAGE, TranslatableField, IntlSetting } from 'global-utils';
import { styles } from './styles';

export interface IEditorInputProps extends WrappedFieldProps, WithStyles<typeof styles> {
  selectedLanguage: string;
}

const getEditorState = (html: string): EditorState => {
  const blocksFromHTML = convertFromHTML(html);
  const { contentBlocks, entityMap } = blocksFromHTML;
  if (contentBlocks.length > 0) {
    const content = ContentState.createFromBlockArray(contentBlocks, entityMap);
    return EditorState.createWithContent(content);
  }
  return EditorState.createEmpty();
};

// TODO: Memoize this fn
const getInitialValue = (value: TranslatableField): IntlSetting<EditorState>  => {
  return LANGUAGES.reduce((acc: IntlSetting<EditorState>, lang) => {
    acc[lang] = value[lang] ? getEditorState(value[lang]) : EditorState.createEmpty();
    return acc;
  }, {});
};

class TextEditorComponent extends React.Component<IEditorInputProps, any> {
  constructor(props: IEditorInputProps) {
    super(props);
    this.state = {
      editor: getInitialValue(this.props.input.value)
    };
  }

  handleChange = (lang: string) => (newValue: EditorState) => {
    const oldState = this.state.editor;
    const newState = { ...oldState, [lang]: newValue };

    this.setState({ editor: newState });
    this.onChange(newState);
  }

  handleKeyCommand = (lang: string) => (command: DraftEditorCommand) => {
    const oldState = this.state.editor;
    const oldValue = oldState[lang];
    const newValue = RichUtils.handleKeyCommand(oldValue, command);
    const newState = { ...oldState, [lang]: newValue };

    if (newValue) {
      this.setState({ editor: newState });
      this.onChange(newState);
      return 'handled';
    }
    return 'not-handled';
  }

  handleInlineStyle = (lang: string, style: string) => () => {
    const oldState = this.state.editor;
    const oldValue = oldState[lang];
    const newValue = RichUtils.toggleInlineStyle(oldValue, style);
    const newState = { ...oldState, [lang]: newValue };
    this.setState({ editor: newState });
    this.onChange(newState);
  }

  handleBlockType = (lang: string, type: DraftBlockType) => () => {
    const oldState = this.state.editor;
    const oldValue = oldState[lang];
    const newValue = RichUtils.toggleBlockType(oldValue, type);
    const newState = { ...oldState, [lang]: newValue };
    this.setState({ editor: newState });
    this.onChange(newState);
  }

  updateStoreValue = (value: TranslatableField) => {
    this.props.input.onChange(value);
  }

  onChange = debounce(this.updateStoreValue, 600);

  showError = (language: string) => {
    const { meta, selectedLanguage } = this.props;
    const hasError = Boolean(meta.touched && meta.invalid && meta.error);
    if (language) {
      return hasError && selectedLanguage === DEFAULT_LANGUAGE && language === DEFAULT_LANGUAGE;
    }
    return hasError;
  }

  getActiveInlineClass = (lang: string, style: string) => {
    const editorState = this.state.editor[lang];
    const currentStyle = editorState.getCurrentInlineStyle();
    return currentStyle.has(style) ? this.props.classes.activeButton : '';
  }

  renderInlineIcons = (lang: string) => {
    return (
      <React.Fragment>
        <FormatBold
          className={this.getActiveInlineClass(lang, 'BOLD')}
          onClick={this.handleInlineStyle(lang, 'BOLD')}
        />
        <FormatItalic
          className={this.getActiveInlineClass(lang, 'ITALIC')}
          onClick={this.handleInlineStyle(lang, 'ITALIC')}
        />
        <FormatUnderlined
          className={this.getActiveInlineClass(lang, 'UNDERLINE')}
          onClick={this.handleInlineStyle(lang, 'UNDERLINE')}
        />
      </React.Fragment>
    );
  }

  getActiveBlockClass = (lang: string, type: DraftBlockType) => {
    const editorState = this.state.editor[lang];
    const selection = editorState.getSelection();
    const blockType = editorState
      .getCurrentContent()
      .getBlockForKey(selection.getStartKey())
      .getType();

    return blockType === type ? this.props.classes.activeButton : '';
  }

  renderBlockIcons = (lang: string) => (
    <FormatUnorderedList
      className={this.getActiveBlockClass(lang, 'unordered-list-item')}
      onClick={this.handleBlockType(lang, 'unordered-list-item')}
    />
  )

  renderInput = (value: EditorState, language: string) => {
    const { classes, selectedLanguage } = this.props;
    return (
      <div
        className={`${classes.wrapper} ${language !== selectedLanguage ? classes.hidden : ''}`}
        key={language}
      >
        <div className={classes.toolbar}>
          {this.renderInlineIcons(selectedLanguage)}
          {this.renderBlockIcons(selectedLanguage)}
        </div>
        <div className={classes.editor}>
          <Editor
            editorState={value}
            handleKeyCommand={this.handleKeyCommand(language)}
            onChange={this.handleChange(language)}
          />
        </div>
      </div>
    );
  }

  render() {
    return LANGUAGES.map(lang => this.renderInput(this.state.editor[lang], lang));
  }
}

export const TextEditor = withStyles(styles)(TextEditorComponent) as any;
