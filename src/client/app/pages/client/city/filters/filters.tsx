import React, { memo, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { History } from 'history';
import { useDispatch } from 'react-redux';
import { setCityFilters } from 'actions/filters';
import { PriceFilter } from './priceFilter';
import { TypesFilter } from './typesFilter';
import { MatchParams } from '../types';

import { useStyles } from './styles';
import { getFiltersFromSearchParams } from './utils';

type Props = {
  cityId: string;
};

const Filters: React.FunctionComponent<Props> = props => {
  const classes = useStyles();
  const params = useParams() as MatchParams;
  const history = useHistory() as History;
  const dispatch = useDispatch();

  useEffect(() => {
    const searchParams = new URLSearchParams(history.location.search);
    const filters = getFiltersFromSearchParams(searchParams);
    if (Object.keys(filters).length) {
      dispatch(setCityFilters(props.cityId, filters));
    }
  }, []);

  return (
    <div className={classes.wrapper}>
      <TypesFilter
        params={params}
        cityId={props.cityId}
        history={history}
      />
      <PriceFilter
        params={params}
        cityId={props.cityId}
        history={history}
      />
    </div>
  );
};

export default memo(Filters);
