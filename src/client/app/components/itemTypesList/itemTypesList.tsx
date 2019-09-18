import * as React from 'react';
import { connect } from 'react-redux';
import { ITypesMap, IAppState } from 'types';
import { getTypesMap } from 'selectors';
import { getLocalizedText } from 'client-utils/methods';

interface IOwnProps {
  typeIds: string[];
  locale: string;
}

interface IStateProps {
  typesMap: ITypesMap;
}

type ItemsTypesListProps = IOwnProps & IStateProps;

const ItemTypesList = ({typeIds, typesMap, locale}: ItemsTypesListProps) => {
  return (
    <React.Fragment>
      {
        typeIds.map((typeId) => {
          const type = typesMap[typeId];
          if (type) {
            return (
              <span key={typeId} className="types" style={{ fontSize: 12 + 'px' }}>
                {getLocalizedText(typesMap[typeId].name, locale)}
                &nbsp;
              </span>
            );
          }
          return null;
        })
      }
    </React.Fragment>
  );
};

const mapStateToProps = (state: IAppState) => ({
  typesMap: getTypesMap(state)
});

export default connect<IStateProps, {}, IOwnProps>(mapStateToProps)(ItemTypesList);
