import { WrappedComponentProps as InjectedIntlProps } from 'react-intl';
import { EditorState } from 'draft-js';
import { IItemDescFields } from 'global-utils';
import { TranslatableField } from 'global-utils/data-models';
import { updateItemDescription } from 'actions/items';
import { ThunkReturn } from 'types';
import { CreateEditItemProps } from '../types';

export type TranslatableEditorState = Record<keyof TranslatableField, EditorState>;

export type ISubmitDescFields = {
  [K in keyof IItemDescFields]: K extends 'description' ? TranslatableEditorState : TranslatableField
};

export interface IOwnProps extends CreateEditItemProps, InjectedIntlProps {}

export interface IStateProps {
  showNavigationPrompt: boolean;
}

export interface IDispatchProps {
  updateItemDescription: ThunkReturn<typeof updateItemDescription>;
  initializeForm: (description: IItemDescFields) => void;
}

export type Props = IOwnProps & IStateProps & IDispatchProps;
