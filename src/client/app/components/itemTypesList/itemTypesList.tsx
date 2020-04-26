import * as React from 'react';
import { connect } from 'react-redux';
import { ITypesMap, IAppState } from 'types';
import { Locale } from 'global-utils/typings';
import { getTypesMap } from 'selectors';
import { getLocalizedText } from 'client-utils/methods';

interface IOwnProps {
  typeIds: string[];
  locale: Locale;
}

interface IStateProps {
  typesMap: ITypesMap;
}

type Props = IOwnProps & IStateProps;

const ItemTypesList: React.FunctionComponent<Props> = (props) => {
  const { typeIds, locale, typesMap } = props;
  return (
    <React.Fragment>
      {
        typeIds.map((typeId) => {
          const type = typesMap[typeId];
          if (type) {
            return (
              <span key={typeId} className="types" style={{ fontSize: 12 + 'px' }}>
                {getLocalizedText(locale, typesMap[typeId].name)}
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

const mapStateToProps = (state: IAppState): IStateProps => ({
  typesMap: getTypesMap(state)
});

export default connect<IStateProps, {}, IOwnProps, IAppState>(mapStateToProps)(ItemTypesList);
