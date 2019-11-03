import { InjectedIntlProps } from 'react-intl';
import { EditorState } from 'draft-js';
import { IItemDescFields, TranslatableField } from 'global-utils';

import { ICreateEditItemPageProps } from '../createEditItem';

export type TranslatableEditorState = Record<keyof TranslatableField, EditorState>;

export type ISubmitDescFields = {
  [K in keyof IItemDescFields]: K extends 'description' ? TranslatableEditorState : TranslatableField
};

export interface IOwnProps extends ICreateEditItemPageProps, InjectedIntlProps {}

export interface IStateProps {
  showNavigationPrompt: boolean;
}

export interface IDispatchProps {
  updateItemDescription: (itemId: string, description: IItemDescFields) => Promise<void>;
  initializeForm: (description: IItemDescFields) => void;
}

export type DescriptionPageProps = IOwnProps & IStateProps & IDispatchProps;
