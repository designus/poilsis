import * as React from 'react';
import { connect } from 'react-redux';
import { IAppState } from '../../../reducers';
import { getItem } from '../../../actions';
import { IAdminMenuItem } from '../../../components';
import { itemModel } from '../../../pages';
import { getInitialFormState, ITEM_LOADER_ID } from '../../../client-utils';
import { MAIN_INFO, PHOTO_GALLERY } from '../../../../../data-strings';
import HomeIcon from 'material-ui-icons/Home';
import PhotoIcon from 'material-ui-icons/Photo';

export const CREATE_EDIT_ITEM_LOADER = 'createEditItem';

class CreateEditItemPageComponent extends React.Component<any, any> {

  state = getInitialFormState(itemModel);
  isCreatePage = !Boolean(this.props.params.id);

  constructor(props) {
    super(props);
  }

  getMenuItems(id): IAdminMenuItem[] {
    return [
      {
        icon: () => (<HomeIcon />),
        link: `/admin/items/edit/${id}/main`,
        text: MAIN_INFO,
      },
      {
        icon: () => (<PhotoIcon />),
        link: `/admin/items/edit/${id}/photos`,
        text: PHOTO_GALLERY,
      },
    ];
  }

  componentDidMount() {
    const id = this.props.params.id;
    this.props.getItem(id);
    this.props.setMenuItems(this.getMenuItems(id));
  }

  componentWillUpdate() {
    this.props.setMenuItems(this.getMenuItems(this.props.params.id));
  }

  render() {

    const id = this.props.params.id;
    const loadedItem = this.props.itemsMap[id];

    if (loadedItem || this.isCreatePage) {

      return (
        <div>
          {React.cloneElement(this.props.children, {
            loadedItem,
            itemsMap: this.props.itemsMap,
            citiesMap: this.props.citiesMap,
            typesMap: this.props.typesMap,
          })}
        </div>
      );
    } else {
      return null;
    }
  }
};

const mapStateToProps = (state: IAppState) => {
  return {
    itemsMap: state.items.dataMap,
    citiesMap: state.cities.dataMap,
    typesMap: state.types.dataMap,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getItem: (itemId) => dispatch(getItem(itemId, ITEM_LOADER_ID)),
  };
};

export const CreateEditItemPage = connect(mapStateToProps, mapDispatchToProps)(CreateEditItemPageComponent);
